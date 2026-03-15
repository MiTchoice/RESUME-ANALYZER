/**
 * ai.js — Gemini 2.5 Flash using @google/genai SDK (free tier)
 * Get your free key: https://aistudio.google.com/app/apikey
 */
const { GoogleGenAI } = require('@google/genai');

let _client = null;

function getClient() {
  if (!_client) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not set. Get a free key at https://aistudio.google.com/app/apikey');
    }
    _client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _client;
}

function messagesToPrompt(messages) {
  return messages
    .map(m => {
      if (m.role === 'system') return '[Instructions]\n' + m.content;
      if (m.role === 'assistant') return '[Assistant]\n' + m.content;
      return m.content;
    })
    .join('\n\n');
}

async function chat(messages, options) {
  options = options || {};
  const ai = getClient();
  const prompt = messagesToPrompt(messages);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      temperature: options.temperature != null ? options.temperature : 0.7,
      maxOutputTokens: options.max_tokens || 8192
    }
  });
  return response.text.trim();
}

async function chatJSON(messages, options) {
  options = options || {};

  var augmented = messages.map(function(m, i) {
    if (i === messages.length - 1 && m.role === 'user') {
      return Object.assign({}, m, {
        content: m.content + '\n\nCRITICAL INSTRUCTION: Your ENTIRE response must be ONLY a single valid complete JSON object. No markdown, no code fences, no backticks, no explanation before or after. Start your response with { and end with }. Do NOT truncate or cut off the JSON. Ensure all brackets and braces are properly closed.'
      });
    }
    return m;
  });

  // Increase token limit for JSON responses to prevent truncation
  var jsonOptions = Object.assign({}, options, {
    max_tokens: options.max_tokens ? Math.max(options.max_tokens, 8192) : 8192
  });

  var text = await chat(augmented, jsonOptions);

  // Clean markdown fences if present
  var clean = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // Try direct parse first
  try {
    return JSON.parse(clean);
  } catch (e1) {
    // Try to extract complete JSON object
    var match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {
        // Try to fix truncated JSON by closing open structures
        var fixed = attemptJSONFix(match[0]);
        if (fixed) return fixed;
      }
    }
    throw new Error('Gemini returned invalid JSON: ' + clean.slice(0, 300));
  }
}

// Attempt to fix truncated JSON by closing unclosed brackets/braces/strings
function attemptJSONFix(str) {
  try {
    var fixed = str.trim();
    // Count unclosed structures
    var opens = [];
    var inString = false;
    var escape = false;
    for (var i = 0; i < fixed.length; i++) {
      var c = fixed[i];
      if (escape) { escape = false; continue; }
      if (c === '\\' && inString) { escape = true; continue; }
      if (c === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (c === '{') opens.push('}');
      else if (c === '[') opens.push(']');
      else if (c === '}' || c === ']') opens.pop();
    }
    // Close any open string
    if (inString) fixed += '"';
    // Close any open structures in reverse
    while (opens.length > 0) {
      fixed += opens.pop();
    }
    return JSON.parse(fixed);
  } catch (e) {
    return null;
  }
}

module.exports = { chat: chat, chatJSON: chatJSON };
