import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetSuggest } from "~/presentation/hooks/gemini/useGetSuggest";
import { renderText } from "~/domain/value-objects/MarkDownHelper";
import { SuggestAcupoint, SuggestResult } from "~/domain/entities/Suggestion";
import { Button } from "~/presentation/designSystem";
import { useGetMeridianNames } from "~/presentation/hooks/meridian/useGetMeridianNames";

type ChatMessage =
  | {
      id: string;
      role: "user";
      text: string;
      image?: string;
      createdAt: string;
    }
  | {
      id: string;
      role: "assistant";
      text: string;
      acupoints: SuggestAcupoint[];
      createdAt: string;
    };

const HISTORY_STORAGE_KEY = "suggestAssistantHistory";

function Suggest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    symptoms: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { getSuggest, loading: suggestLoading, error: suggestError } = useGetSuggest();
  const [error, setError] = useState("");
  const {meridians, loading: meridiansLoading, error: meridiansError} = useGetMeridianNames();

  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        setMessages(parsed);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
      // Clear corrupt data
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  // Persist messages whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (messages.length > 0) {
      try {
        window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(messages));
      } catch (err) {
        console.error("Failed to persist chat history:", err);
      }
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const text = formData.symptoms.trim();
    if (!text && !selectedImage) return;

    let imageDisplay = '';
    if (selectedImage) {
      imageDisplay = `[Image: ${selectedImage.name}]`;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: text || imageDisplay,
      image: imagePreview || undefined,
      createdAt: new Date().toISOString(),
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setFormData({ symptoms: "" });
    setSelectedImage(null);
    setImagePreview(null);

    try {
      const results = await getSuggest(text, selectedImage || undefined);
      
      if (results.error) {
        setError(results.error || "Failed to suggest");
        return;
      }

      const suggestResult = results.result as SuggestResult;
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        text: suggestResult.text,
        acupoints: suggestResult.acupoints,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ symptoms: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (7MB limit)
      if (file.size > 7 * 1024 * 1024) {
        setError('Image file size must be less than 7MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all chat history?")) {
      setMessages([]);
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  };

 const normalize = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "")        // remove spaces
    .replace(/[-/\\.,]/g, "");  // remove dashes, slashes, dots, commas

const isMeridianExist = (name: string) =>
  meridians.some((meridian) => normalize(meridian) === normalize(name));

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-[90vh] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#1FA1AF]">Suggest Assistant</h1>
            <p className="text-sm text-gray-600">
              Describe the patient's symptoms or upload an image, and I'll suggest acupoints.
            </p>
          </div>
          {hasMessages && (
            <button
              onClick={clearHistory}
              className="px-3 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!hasMessages && !suggestError && !error && (
         <div className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
    
         <p className="text-gray-600 font-medium">
           Start by typing symptoms, uploading an image, or both below and press <span className="font-semibold text-gray-800">Send</span>.
         </p>
     
         <ul className="mt-4 text-sm text-gray-500 text-left list-disc list-inside space-y-1">
           <li>Onset and duration</li>
           <li>Frequency and progression</li>
           <li>Severity (pain scale)</li>
           <li>Location</li>
           <li>Upload images of affected areas (optional)</li>
         </ul>
     
       </div>
        )}

        {(error || suggestError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || suggestError}
          </div>
        )}

        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="flex justify-end">
              <div className="bg-[#1FA1AF] text-white rounded-lg px-4 py-2 max-w-[70%]">
                {message.text}
                {message.image && (
                  <img 
                    src={message.image} 
                    alt="User uploaded" 
                    className="mt-2 rounded-lg max-w-full h-auto"
                    style={{ maxHeight: '200px' }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 max-w-[80%]">
                <div className="prose prose-sm max-w-none">
                  {renderText(message.text)}
                </div>
                {message.acupoints && message.acupoints.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h4 className="font-semibold text-sm mb-2">Suggested acupoints</h4>
                    <ul className="space-y-2 text-sm">
                      {message.acupoints.map((item: SuggestAcupoint, index: number) => (
                        <li key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <strong className="text-gray-900">{item.acupoint}</strong>
                              <div className="text-xs text-gray-600 mt-1">
                                Meridian: {item.meridian} 
                              </div>
                              {item.illness_id && (
                                <div className="text-xs text-gray-600 mt-1">
                                Illness: {item.illness}
                              </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {item.illness_id && (
                              <Button
                                onClick={() =>
                                  navigate("/illnessAcupunctureShow", {
                                    state: { illnessId: item.illness_id },
                                  })
                                }
                              variant="primary"
                              size="sm"
                              >
                                View Illness
                              </Button>
                            )}
                            {isMeridianExist(item.meridian) && (
                            <Button
                              onClick={() =>
                                navigate("/meridianAcupunctureShow", {
                                  state: { meridianName: item.meridian },
                                })
                              }
                              variant="primary"
                              size="sm"
                              >
                              View Meridian
                            </Button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Describe symptoms..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1FA1AF] focus:border-transparent"
            rows={3}
            disabled={suggestLoading}
          />
          
          {/* Image upload area */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={suggestLoading}
                />
                <div className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Image
                </div>
              </label>
              
              {selectedImage && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear Image
                </button>
              )}
            </div>
            
            {imagePreview && (
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="rounded-lg max-w-full h-auto border border-gray-200"
                  style={{ maxHeight: '150px' }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {selectedImage?.name} ({(selectedImage?.size ? (selectedImage.size / 1024 / 1024).toFixed(2) : '0')} MB)
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end items-center gap-3">
            {suggestLoading && (
              <span className="text-xs text-gray-500">Analyzing symptoms...</span>
            )}
            <button
              type="submit"
              disabled={suggestLoading || (!formData.symptoms.trim() && !selectedImage)}
              className="px-4 py-1.5 rounded-full bg-[#1FA1AF] text-white text-sm font-semibold hover:bg-[#178995] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Suggest;