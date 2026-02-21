const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const classifyComplaint = async (description, imageUrl) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Classify the following municipal grievance:
      Description: ${description}
      
      Categories: ROAD, WATER, GARBAGE, STREETLIGHT, SANITATION, OTHER
      Departments: ROADS_AND_INFRASTRUCTURE, WATER_SUPPLY, SOLID_WASTE_MANAGEMENT, STREET_LIGHTING, SANITATION

      Return a JSON object with:
      - category: One of the listed categories
      - priority: A base score from 1-10
      - department: One of the listed departments
      - summary: A very brief summary (max 10 words)
    `;

        // If there's an image, Gemini can process it too (simplified for now to text only if no direct image buffer handling yet)
        // For a real implementation, we'd fetch the image or pass the base64

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response (handling potential markdown)
        const jsonMatch = text.match(/\{.*\}/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return {
            category: "OTHER",
            priority: 5,
            department: "SANITATION",
            summary: "Manual review required"
        };
    } catch (error) {
        console.error("Gemini Classification Error:", error);
        return {
            category: "OTHER",
            priority: 5,
            department: "SANITATION",
            summary: "Classification failed"
        };
    }
};

module.exports = { classifyComplaint };
