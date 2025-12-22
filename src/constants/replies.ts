export const REPLIES = [
  {
    id: "welcome",
    message:
      "Welcome to Kasa Support Services. We are here to support you.\n\n* If you want to report a case, press 1.\n* If you want to learn about SGBV, reporting channels, and forms of SGBV, press 2.",
    options: [
      {
        id: "1",
        suggestion: "Report a case",
        nextMessageId: "report_intro",
      },
      {
        id: "2",
        suggestion: "Learn about SGBV",
        nextMessageId: "learn_intro",
      },
    ],
    nextMessageId: null,
    terminate: null,
  },

  // REPORT A CASE flow
  {
    id: "report_intro",
    message:
      "You have chosen to report a case. Your safety is our priority. Please answer the following:",
    options: [
      {
        id: "continue",
        suggestion: "Continue",
        nextMessageId: "report_q1",
      },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "report_q1",
    message:
      "What type of case do you want to report?\n(1) Physical abuse\n(2) Sexual violence\n(3) Emotional abuse\n(4) Economic abuse\n(5) Other",
    options: [
      {
        id: "1",
        suggestion: "Physical abuse",
        nextMessageId: "report_q2",
      },
      {
        id: "2",
        suggestion: "Sexual violence",
        nextMessageId: "report_q2",
      },
      {
        id: "3",
        suggestion: "Emotional abuse",
        nextMessageId: "report_q2",
      },
      {
        id: "4",
        suggestion: "Economic abuse",
        nextMessageId: "report_q2",
      },
      { id: "5", suggestion: "Other", nextMessageId: "report_q2" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "report_q2",
    message: "Where did the incident happen? (Please type the location)",
    options: null,
    nextMessageId: "report_q3",
    terminate: null,
  },
  {
    id: "report_q3",
    message:
      "When did the incident happen? (Please provide date and time if possible)",
    options: null,
    nextMessageId: "report_q4",
    terminate: null,
  },
  {
    id: "report_q4",
    message: "Are you the victim?",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "report_q5" },
      { id: "no", suggestion: "No", nextMessageId: "report_q5" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "report_q5",
    message: "Do you need immediate emergency assistance? (Yes/No)",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "report_emergency" },
      { id: "no", suggestion: "No", nextMessageId: "report_thanks" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "report_emergency",
    message:
      "Please call [0256065608] right away for urgent help.\nWe are also notifying our support team to follow up.\n\nWould you like to go back to the Main Menu?",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "welcome" },
      { id: "no", suggestion: "No", nextMessageId: "exit" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "report_thanks",
    message:
      "Thank you for reporting. Your case has been logged securely. A support officer will reach out to you shortly.\n\nWould you like to go back to the Main Menu?",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "welcome" },
      { id: "no", suggestion: "No", nextMessageId: "exit" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "report_end",
    message: "Would you like to go back to the Main Menu? (Yes/No)",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "welcome" },
      { id: "no", suggestion: "No", nextMessageId: "exit" },
    ],
    nextMessageId: null,
    terminate: null,
  },

  // LEARN MORE ABOUT SGBV flow
  {
    id: "learn_intro",
    message:
      "You have chosen to learn more about SGBV. Please select an option:\n(1) What is SGBV?\n(2) Forms of SGBV\n(3) Causes of SGBV\n(4) Effects of SGBV\n(5) How to report SGBV\n(6) Support services available\n(7) Referral pathways\n(8) Back to Main Menu",
    options: [
      {
        id: "1",
        suggestion: "What is SGBV?",
        nextMessageId: "learn_what",
      },
      {
        id: "2",
        suggestion: "Forms of SGBV",
        nextMessageId: "learn_forms",
      },
      {
        id: "3",
        suggestion: "Causes of SGBV",
        nextMessageId: "learn_causes",
      },
      {
        id: "4",
        suggestion: "Effects of SGBV",
        nextMessageId: "learn_effects",
      },
      {
        id: "5",
        suggestion: "How to report SGBV",
        nextMessageId: "learn_howto",
      },
      {
        id: "6",
        suggestion: "Support services",
        nextMessageId: "learn_support",
      },
      {
        id: "7",
        suggestion: "Referral pathways",
        nextMessageId: "learn_referral",
      },
      {
        id: "8",
        suggestion: "Back to Main Menu",
        nextMessageId: "welcome",
      },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "learn_what",
    message:
      "Sexual and gender-based violence (SGBV) is violence committed against a person because of his or her sex or gender. It is forcing another person to do something against his or her will through violence, coercion, threats, deception, cultural expectations, or economic means. Although the majority of victims and survivors of SGBV are girls and women, boys and men can also be harmed by SGBV. Domestic Violence in the form of physical or sexual violence, is experienced by 35 percent of women globally during their lifetime. Emotional abuse and controlling behavior are experienced by 75 percent of women across the world. It is also acknowledged that men experience domestic violence.\n\nWould you like to learn more? (Yes/No)",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "learn_intro" },
      { id: "no", suggestion: "No", nextMessageId: "exit" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "learn_forms",
    message:
      "The main forms of SGBV include:\n* Physical violence (beating, assault, child marriage, FGM)\n* Sexual violence (rape, harassment, exploitation)\n* Emotional/psychological abuse (threats, humiliation, intimidation)\n* Economic abuse (denial of resources, restricting access to work/education)\n\nWould you like to go back to the Learn More menu? (Yes/No)",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "learn_intro" },
      { id: "no", suggestion: "No", nextMessageId: "exit" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "learn_causes",
    message:
      "The root causes of SGBV include:\n* Unequal power relations between men and women\n* Cultural and traditional practices that tolerate violence\n* Alcoholism and substance abuse, which often trigger violent behavior\n* Economic hardship and dependency\n* Weak enforcement of laws and policies\n\nWould you like to go back to the Learn More menu? (Yes/No)",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "learn_intro" },
      { id: "no", suggestion: "No", nextMessageId: "exit" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "learn_effects",
    message:
      "SGBV can have serious effects on survivors and communities, including:\n* Physical injuries and long-term health problems\n* Mental health issues such as trauma, depression, and anxiety\n* Unwanted pregnancies & sexually transmitted infections\n* Social isolation and stigma\n* Economic impact (loss of work or education opportunities)\n\nWould you like to go back to the Learn More menu? (Yes/No)",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "learn_intro" },
      { id: "no", suggestion: "No", nextMessageId: "exit" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "learn_howto",
    message:
      "You can report SGBV through:\n* The Kasa Support Services platform\n* Local police/domestic violence units\n* Health facilities for medical & psychosocial support\n* National hotlines for SGBV survivors\n\nWould you like to go back to the Learn More menu? (Yes/No)",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "learn_intro" },
      { id: "no", suggestion: "No", nextMessageId: "exit" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "learn_support",
    message:
      "Survivors of SGBV can access:\n* Medical care\n* Counseling and psychosocial support\n* Legal aid and justice services\n* Shelter and protection services\n\nWould you like to go back to the Learn More menu? (Yes/No)",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "learn_intro" },
      { id: "no", suggestion: "No", nextMessageId: "exit" },
    ],
    nextMessageId: null,
    terminate: null,
  },
  {
    id: "learn_referral",
    message:
      "Survivors of SGBV can be referred to specialized services, such as:\n* Police and Domestic Violence & Victim Support Units (DOVVSU)\n* Health facilities for medical treatment & evidence collection\n* Social welfare offices for protection and support\n* Commission for Human Rights and administrative Justice (CHRAJ)\n* NGOs and community organizations that provide counseling & safe shelters\n* Legal aid services to help with justice processes\n\nWould you like to go back to the Learn More menu? (Yes/No)",
    options: [
      { id: "yes", suggestion: "Yes", nextMessageId: "learn_intro" },
      { id: "no", suggestion: "No", nextMessageId: "exit" },
    ],
    nextMessageId: null,
    terminate: null,
  },

  // EXIT
  {
    id: "exit",
    message:
      "Thank you for using Kasa Support Services. You are not alone—we are here to support you. Stay safe.",
    options: null,
    nextMessageId: null,
    terminate: true,
  },
];

export default REPLIES;
