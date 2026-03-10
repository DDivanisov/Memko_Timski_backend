const ort = require("onnxruntime-node");
const { pipeline, AutoTokenizer } = require("@xenova/transformers");
const path = require("path");

let session_issue, tokenizer, session_priority;

const id2label_issue = {
  "0": "Bug",
  "1": "Improvement",
  "2": "New Feature",
  "3": "Sub-task",
  "4": "Task"
};

const id2label_priority = {
  "0": "High",
  "1": "Low",
  "2": "Medium"
}

async function init() {
  session_issue = await ort.InferenceSession.create(path.join(__dirname, "model_issue_type.onnx"));
  tokenizer = await AutoTokenizer.from_pretrained("Xenova/bert-base-uncased");

  session_priority = await ort.InferenceSession.create(path.join(__dirname, "model_priority_type.onnx"));
  
  console.log("Model loaded");
}

async function predict_issue_type(text) {
  const encoded = await tokenizer(text, { truncation: true, max_length: 512 });
  const ids = Array.from(encoded.input_ids.data);
  const mask = Array.from(encoded.attention_mask.data);

  const inputIds = new ort.Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, ids.length]);
  const attentionMask = new ort.Tensor("int64", BigInt64Array.from(mask.map(BigInt)), [1, mask.length])

  const output = await session_issue.run({ input_ids: inputIds, attention_mask: attentionMask });
  const logits = Array.from(output.logits.data);

  const expd = logits.map(Math.exp);
  const sum = expd.reduce((a, b) => a + b, 0);
  const probs = expd.map(v => v / sum);

  const topIdx = probs.indexOf(Math.max(...probs));
  return { prediction: id2label_issue[topIdx], confidence: probs[topIdx] };
}

async function predict_priority_type(text) {
  const encoded = await tokenizer(text, { truncation: true, max_length: 512 });
  const ids = Array.from(encoded.input_ids.data);
  const mask = Array.from(encoded.attention_mask.data);

  const inputIds = new ort.Tensor("int64", BigInt64Array.from(ids.map(BigInt)), [1, ids.length]);
  const attentionMask = new ort.Tensor("int64", BigInt64Array.from(mask.map(BigInt)), [1, mask.length])

  const output = await session_priority.run({ input_ids: inputIds, attention_mask: attentionMask });
  const logits = Array.from(output.logits.data);

  const expd = logits.map(Math.exp);
  const sum = expd.reduce((a, b) => a + b, 0);
  const probs = expd.map(v => v / sum);

  const topIdx = probs.indexOf(Math.max(...probs));
  return { prediction: id2label_priority[topIdx], confidence: probs[topIdx] };
}


module.exports = { init, predict_issue_type, predict_priority_type};