

interface PatientData {
  firstName: string;
  lastName?: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  maritalStatus: string;
  occupation: string;
  phone: string;
  email: string;
  addresses?: { addressLine?: string }[];
  notes?: string;
}

const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};



export const buildPatientAnalysisPrompt = (patient: PatientData) => `
You are a professional medical assistant AI.

Analyze the following patient data and provide a structured clinical summary.

⚠️ Rules:
- Do NOT provide diagnosis as final medical advice
- Only give insights, risks, and recommendations
- Keep response concise and structured
- Use simple medical language

------------------------
👤 Patient Information:
- Name: ${patient.firstName} ${patient.lastName ?? ""}
- Gender: ${patient.gender}
- Age: ${calculateAge(patient.dateOfBirth)} years
- Blood Group: ${patient.bloodGroup}
- Marital Status: ${patient.maritalStatus}
- Occupation: ${patient.occupation}

📞 Contact:
- Phone: ${patient.phone}
- Email: ${patient.email}

📍 Address:
- ${patient.addresses?.[0]?.addressLine ?? "N/A"}

📝 Notes:
- ${patient.notes ?? "No notes"}

------------------------

🔍 Analyze and return:

1. Patient Summary (short)
2. Risk Factors (if any)
3. Possible Health Concerns
4. Lifestyle Recommendations
5. Follow-up Suggestions

⚠️ Rules:
- Return ONLY valid JSON
- Do NOT use markdown
- Do NOT add explanation
- All keys MUST be present
- If no data, return empty string "" or empty array []

⚠️ JSON FORMAT (STRICT):
{
  "summary": "string",
  "risks": ["string"],
  "concerns": ["string"],
  "recommendations": ["string"],
  "followUp": ["string"]
}
`;


