const { config } = require('../config/app.config');

async function predict_issue_type(text) {
  
  let res = await fetch(
    `${config.MODEL_ENDPOINT}/predict-issue`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  let data = await res.json();
  return { prediction: data.prediction, confidence: data.confidence };
}

async function predict_priority_type(text) {
  let res = await fetch(
    `${config.MODEL_ENDPOINT}/predict-priority`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  let data = await res.json();
  return { prediction: data.prediction, confidence: data.confidence };
}


module.exports = { predict_issue_type, predict_priority_type};