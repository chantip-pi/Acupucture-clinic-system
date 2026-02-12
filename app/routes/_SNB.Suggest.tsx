import { useState, ChangeEvent, FormEvent } from "react";
import { useGetSuggest } from "~/presentation/hooks/gemini/useGetSuggest";
import { renderText } from "~/domain/value-objects/MarkDownHelper";
import { SuggestAcupoint } from "~/domain/entities/Suggestion";

function Suggest() {
  const [formData, setFormData] = useState({
    symptoms: "",
  });
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  const { getSuggest, loading, error: hookError, result } = useGetSuggest();
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLastPrompt(formData.symptoms);

    const results = await getSuggest(formData.symptoms);

    if (results.error) {
      setError(results.error || "Failed to suggest");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      symptoms: e.target.value,
    });
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full max-w-3xl h-full bg-white  overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 flex  justify-between">
          <div>
            <h1 className="text-[#1FA1AF] text-xl font-bold">Suggest Assistant</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Describe the patient&apos;s symptoms and I&apos;ll suggest acupoints.
            </p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-slate-50 px-4 py-3 overflow-y-auto space-y-4">
          {!result && !hookError && !error && (
            <div className="text-center text-xs text-gray-500 mt-8">
              Start by typing symptoms below and pressing <span className="font-semibold">Send</span>.
            </div>
          )}

          {(error || hookError) && (
            <div className="flex justify-center">
              <div className="max-w-xs rounded-2xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                {error || hookError}
              </div>
            </div>
          )}

          {lastPrompt && (
            <div className="flex justify-end">
              <div className="max-w-xs rounded-2xl bg-[#1FA1AF] text-white px-3 py-2 text-sm shadow-md">
                {lastPrompt}
              </div>
            </div>
          )}

          {result && (
            <div className="flex justify-start">
              <div className="max-w-md rounded-2xl bg-white px-3 py-2 text-sm shadow">
                <div className="prose prose-sm max-w-none mb-3 text-gray-800">
                  {renderText(result.text)}
                </div>

                {result.acupoints && result.acupoints.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-xs font-semibold text-gray-600 mb-1">
                      Suggested acupoints
                    </h3>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-800">
                      {result.acupoints.map((item: SuggestAcupoint, index: number) => (
                        <li key={index}>
                          <span className="font-semibold">{item.acupoint}</span>
                          {` – Meridian: ${item.meridian}, Illness: ${item.illness}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white px-4 py-3">
          <div className="flex flex-col gap-2">
            <textarea
              id="symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              className="w-full py-2 px-3 bg-gray-50 text-sm rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1FA1AF] min-h-[70px] resize-none"
              placeholder="Describe the symptoms in detail..."
              required
            />

            <div className="flex justify-end items-center gap-3">
              {loading && (
                <span className="text-xs text-gray-500">Analyzing symptoms...</span>
              )}
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded-full bg-[#1FA1AF] text-white text-sm font-semibold hover:bg-[#178995] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Suggest;