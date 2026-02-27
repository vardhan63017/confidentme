export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("resume") as File

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 })
    }

    let resumeText = ""

    if (file.type === "application/pdf") {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const pdfContent = buffer.toString("latin1")

      // Extract readable text from PDF
      const textMatches = pdfContent.match(/$$([^)]+)$$/g)
      if (textMatches) {
        resumeText = textMatches
          .map((match) => match.slice(1, -1))
          .join(" ")
          .replace(/\\n/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      }

      // Try BT/ET blocks if basic extraction didn't work
      if (resumeText.length < 100) {
        const btBlocks = pdfContent.match(/BT[\s\S]*?ET/g)
        if (btBlocks) {
          resumeText = btBlocks
            .join(" ")
            .replace(/[^\x20-\x7E\n]/g, " ")
            .replace(/\s+/g, " ")
            .trim()
        }
      }
    } else {
      resumeText = await file.text()
    }

    const lowerText = resumeText.toLowerCase()

    // Skill detection categories
    const skillCategories = {
      programming: [
        "javascript",
        "typescript",
        "python",
        "java",
        "c++",
        "c#",
        "ruby",
        "php",
        "swift",
        "kotlin",
        "go",
        "rust",
        "scala",
      ],
      frontend: [
        "react",
        "angular",
        "vue",
        "next.js",
        "nextjs",
        "html",
        "css",
        "tailwind",
        "bootstrap",
        "sass",
        "redux",
      ],
      backend: [
        "node.js",
        "nodejs",
        "express",
        "django",
        "flask",
        "spring",
        "laravel",
        ".net",
        "fastapi",
        "graphql",
        "rest api",
      ],
      database: ["sql", "mysql", "postgresql", "mongodb", "redis", "firebase", "dynamodb", "oracle", "cassandra"],
      cloud: ["aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "jenkins", "ci/cd", "terraform"],
      data: [
        "machine learning",
        "data science",
        "pandas",
        "numpy",
        "tensorflow",
        "pytorch",
        "tableau",
        "power bi",
        "analytics",
      ],
      mobile: ["react native", "flutter", "ios", "android", "swift", "kotlin"],
      design: ["figma", "sketch", "adobe", "photoshop", "illustrator", "ui/ux", "user experience"],
      management: ["agile", "scrum", "jira", "project management", "team lead", "manager", "director"],
      soft: ["communication", "leadership", "teamwork", "problem solving", "analytical"],
    }

    // Detect skills
    const detectedSkills: { category: string; skills: string[] }[] = []
    for (const [category, skills] of Object.entries(skillCategories)) {
      const found = skills.filter((skill) => lowerText.includes(skill.toLowerCase()))
      if (found.length > 0) {
        detectedSkills.push({ category, skills: found })
      }
    }

    // Experience level detection
    const experiencePatterns = [
      /(\d+)\+?\s*years?\s*(of)?\s*(experience|exp)/i,
      /(senior|lead|principal|staff|junior|mid|entry)/i,
      /(\d{4})\s*[-–]\s*(present|\d{4})/gi,
    ]

    let experienceLevel = "professional"
    if (lowerText.includes("senior") || lowerText.includes("lead") || lowerText.includes("principal")) {
      experienceLevel = "senior"
    } else if (lowerText.includes("junior") || lowerText.includes("entry") || lowerText.includes("intern")) {
      experienceLevel = "entry-level"
    }

    // Detect education
    const educationKeywords = [
      "bachelor",
      "master",
      "phd",
      "degree",
      "university",
      "college",
      "mba",
      "b.tech",
      "m.tech",
      "b.e",
      "m.e",
      "bsc",
      "msc",
    ]
    const hasHigherEducation = educationKeywords.some((keyword) => lowerText.includes(keyword))

    // Detect industries/domains
    const industries = {
      tech: ["software", "technology", "tech", "startup", "saas"],
      finance: ["finance", "banking", "fintech", "investment", "trading"],
      healthcare: ["healthcare", "medical", "health", "hospital", "pharma"],
      ecommerce: ["ecommerce", "e-commerce", "retail", "shopping"],
      education: ["education", "edtech", "learning", "school", "university"],
    }

    let detectedIndustry = "technology"
    for (const [industry, keywords] of Object.entries(industries)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        detectedIndustry = industry
        break
      }
    }

    // Generate personalized questions based on detected information
    const questions: string[] = []

    // Skill-based questions
    if (detectedSkills.length > 0) {
      const topCategory = detectedSkills[0]
      const skillList = topCategory.skills.slice(0, 3).join(", ")
      questions.push(
        `I see you have experience with ${skillList}. Can you describe a project where you used these technologies and the challenges you faced?`,
      )

      if (detectedSkills.length > 1) {
        const secondCategory = detectedSkills[1]
        questions.push(
          `Tell me about your experience with ${secondCategory.skills[0]}. How have you applied it in your previous roles?`,
        )
      }
    } else {
      questions.push(
        "Can you walk me through your technical skills and how you've applied them in your previous roles?",
      )
    }

    // Experience level questions
    if (experienceLevel === "senior") {
      questions.push(
        "As a senior professional, describe a time when you mentored team members or led a critical project to success.",
      )
      questions.push("How do you approach architectural decisions and ensure scalability in your solutions?")
    } else if (experienceLevel === "entry-level") {
      questions.push("Tell me about a project from your education or internship that you're most proud of and why.")
      questions.push("How do you stay updated with the latest industry trends and technologies?")
    } else {
      questions.push("Describe a situation where you had to learn a new technology quickly. How did you approach it?")
      questions.push("Tell me about a time when you had to collaborate with cross-functional teams.")
    }

    // Behavioral questions
    questions.push("Describe a challenging problem you encountered in your work. How did you analyze and solve it?")
    questions.push(
      "Tell me about a time when you received critical feedback. How did you handle it and what did you learn?",
    )

    // Industry-specific question
    const industryQuestions: Record<string, string> = {
      tech: "How do you balance shipping features quickly while maintaining code quality and technical debt?",
      finance: "How do you ensure accuracy and security when working with sensitive financial data?",
      healthcare: "How do you approach compliance and data privacy in your technical solutions?",
      ecommerce: "How would you approach optimizing a high-traffic system for performance and user experience?",
      education: "How do you think about building accessible and user-friendly experiences for diverse audiences?",
    }
    questions.push(industryQuestions[detectedIndustry] || industryQuestions.tech)

    // Future-oriented question
    questions.push(
      "Where do you see yourself professionally in the next 3-5 years, and how does this role align with your goals?",
    )

    // Generate summary
    const skillSummary =
      detectedSkills.length > 0
        ? detectedSkills
            .slice(0, 3)
            .map((s) => s.skills.slice(0, 2).join(", "))
            .join("; ")
        : "various professional skills"

    const summary = `${experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} professional with expertise in ${skillSummary}. ${hasHigherEducation ? "Has formal education background. " : ""}Background in the ${detectedIndustry} industry.`

    return Response.json({
      summary,
      questions: questions.slice(0, 7),
      detectedSkills: detectedSkills.flatMap((s) => s.skills).slice(0, 10),
      experienceLevel,
      industry: detectedIndustry,
    })
  } catch (error) {
    console.error("Resume analysis error:", error)

    // Return fallback questions on any error
    return Response.json({
      summary: "Professional candidate ready for interview",
      questions: [
        "Tell me about yourself and your professional background.",
        "What are your key technical skills and how have you applied them?",
        "Describe a challenging project you worked on and how you overcame obstacles.",
        "How do you approach learning new technologies or methodologies?",
        "Tell me about a time when you worked effectively in a team.",
        "What's an achievement in your career that you're most proud of?",
        "Where do you see your career heading in the next few years?",
      ],
      detectedSkills: [],
      experienceLevel: "professional",
      industry: "technology",
    })
  }
}
