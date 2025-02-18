// File: src/js/tf-model.js

const data = [
    { threat: 'Unauthorized Login Attempt', stride: 'Spoofing', dread: 8 },
    { threat: 'SQL Injection', stride: 'Tampering', dread: 9 },
    { threat: 'Data Leak', stride: 'Information Disclosure', dread: 7 },
    { threat: 'DDoS Attack', stride: 'Denial of Service', dread: 9 },
    { threat: 'Privilege Escalation', stride: 'Elevation of Privilege', dread: 8 }
  ];
  
  const encodeCategory = (category) => {
    const categories = ['Spoofing', 'Tampering', 'Repudiation', 'Information Disclosure', 'Denial of Service', 'Elevation of Privilege'];
    return categories.indexOf(category);
  };
  
  async function createModel() {
    const xs = tf.tensor2d(data.map(item => [encodeCategory(item.stride)]));
    const ys = tf.tensor2d(data.map(item => [item.dread]));
  
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [1] }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    await model.fit(xs, ys, { epochs: 100 });
    console.log('Model trained successfully');
    return model;
  }
  
  let trainedModel;
  createModel().then(model => trainedModel = model);
  
  async function predictDread(stride) {
    if (!trainedModel) {
      console.error('Model is not ready');
      return 0;
    }
    const input = tf.tensor2d([[encodeCategory(stride)]]);
    const prediction = trainedModel.predict(input);
    const score = await prediction.data();
    return Math.round(score[0]);
  }
  
  document.getElementById('threatName').addEventListener('blur', async () => {
    const strideCategory = document.getElementById('strideCategory').value;
    if (strideCategory) {
      const predictedScore = await predictDread(strideCategory);
      document.getElementById('dreadScore').value = predictedScore;
    }
  });
  
  document.getElementById('strideCategory').addEventListener('change', async () => {
    const strideCategory = document.getElementById('strideCategory').value;
    if (strideCategory) {
      const predictedScore = await predictDread(strideCategory);
      document.getElementById('dreadScore').value = predictedScore;
    }
  });
  