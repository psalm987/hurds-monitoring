import axios from "axios";

const API_VERSION = import.meta.env.VITE_WHATSAPP_API_VERSION || "v21.0";
const ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
const BUSINESS_ACCOUNT_ID = import.meta.env.VITE_WHATSAPP_BUSINESS_ACCOUNT_ID;
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

export const BUSINESS_PHONE_NUMBER = PHONE_NUMBER_ID;

const whatsappApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export async function sendTextMessage(to, message) {
  try {
    const response = await whatsappApi.post(`/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { preview_url: false, body: message },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function getMessageTemplates() {
  try {
    const response = await whatsappApi.get(
      `/${BUSINESS_ACCOUNT_ID}/message_templates`,
      {
        params: { fields: "name,status,components,language,category" },
      }
    );
    return response.data.data || [];
  } catch (error) {
    console.error(
      "Error fetching templates:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function sendTemplateMessage(
  to,
  templateName,
  languageCode = "en_US",
  components = []
) {
  try {
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "template",
      template: { name: templateName, language: { code: languageCode } },
    };
    if (components.length > 0) payload.template.components = components;
    const response = await whatsappApi.post(
      `/${PHONE_NUMBER_ID}/messages`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error sending template:",
      error.response?.data || error.message
    );
    throw error;
  }
}

export function parseTemplateComponents(template) {
  if (!template.components) return [];
  const fields = [];
  template.components.forEach((component, compIndex) => {
    if (component.type === "HEADER" && component.format) {
      if (
        component.format === "TEXT" &&
        component.text &&
        component.text.includes("{{")
      ) {
        const matches = component.text.match(/\{\{(\d+)\}\}/g);
        if (matches) {
          matches.forEach((match, idx) => {
            fields.push({
              id: `header_text_${idx}`,
              label: `Header Text ${idx + 1}`,
              type: "text",
              componentType: "header",
              componentIndex: compIndex,
              parameterIndex: idx,
            });
          });
        }
      } else if (["IMAGE", "VIDEO", "DOCUMENT"].includes(component.format)) {
        fields.push({
          id: "header_media",
          label: `Header ${component.format} URL`,
          type: "url",
          componentType: "header",
          componentIndex: compIndex,
          mediaType: component.format.toLowerCase(),
        });
      }
    }
    if (component.type === "BODY" && component.text) {
      const matches = component.text.match(/\{\{(\d+)\}\}/g);
      if (matches) {
        matches.forEach((match, idx) => {
          const varNum = match.match(/\d+/)[0];
          fields.push({
            id: `body_${idx}`,
            label: `Body Variable ${varNum}`,
            type: "text",
            componentType: "body",
            componentIndex: compIndex,
            parameterIndex: idx,
          });
        });
      }
    }
    if (component.type === "BUTTON" && component.buttons) {
      component.buttons.forEach((button, btnIdx) => {
        if (button.type === "URL" && button.url && button.url.includes("{{")) {
          fields.push({
            id: `button_${btnIdx}`,
            label: `${button.text} - URL Parameter`,
            type: "text",
            componentType: "button",
            componentIndex: compIndex,
            buttonIndex: btnIdx,
          });
        }
      });
    }
  });
  return fields;
}

export function buildTemplateComponents(fields, formData) {
  const componentMap = {};
  fields.forEach((field) => {
    const value = formData[field.id];
    if (!value) return;
    const key = `${field.componentType}_${field.componentIndex}`;
    if (!componentMap[key]) {
      componentMap[key] = {
        type: field.componentType.toUpperCase(),
        parameters: [],
      };
    }
    if (field.componentType === "header" && field.mediaType) {
      componentMap[key].parameters.push({
        type: field.mediaType,
        [field.mediaType]: { link: value },
      });
    } else if (field.componentType === "button") {
      componentMap[key].sub_type = "url";
      componentMap[key].index = field.buttonIndex;
      componentMap[key].parameters.push({ type: "text", text: value });
    } else {
      componentMap[key].parameters.push({ type: "text", text: value });
    }
  });
  return Object.values(componentMap);
}

export function formatTemplateContent(template, formData) {
  if (!template.components) return template.name;

  let content = "";

  template.components.forEach((component) => {
    if (component.type === "HEADER" && component.text) {
      let headerText = component.text;
      const matches = headerText.match(/\{\{(\d+)\}\}/g);
      if (matches) {
        matches.forEach((match, idx) => {
          const fieldId = `header_text_${idx}`;
          if (formData[fieldId]) {
            headerText = headerText.replace(match, formData[fieldId]);
          }
        });
      }
      content += headerText + "\n\n";
    }

    if (component.type === "BODY" && component.text) {
      let bodyText = component.text;
      const matches = bodyText.match(/\{\{(\d+)\}\}/g);
      if (matches) {
        matches.forEach((match, idx) => {
          const fieldId = `body_${idx}`;
          if (formData[fieldId]) {
            bodyText = bodyText.replace(match, formData[fieldId]);
          }
        });
      }
      content += bodyText + "\n\n";
    }

    if (component.type === "FOOTER" && component.text) {
      content += component.text + "\n";
    }
  });

  return content.trim() || template.name;
}

export default {
  sendTextMessage,
  getMessageTemplates,
  sendTemplateMessage,
  parseTemplateComponents,
  buildTemplateComponents,
  formatTemplateContent,
};
