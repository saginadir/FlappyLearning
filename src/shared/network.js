import Layer from './layer';

export default class Network {
  constructor() {
    this.layers = [];
  }

  perceptronGeneration(input, hiddens, output) {
    let index = 0;
    let previousNeurons = 0;
    let layer;

    layer = new Layer(index);
    layer.populate(input, previousNeurons);
    previousNeurons = input;
    this.layers.push(layer);
    index += 1;

    hiddens.forEach((val, arrayIndex) => {
      layer = new Layer(index);
      layer.populate(hiddens[arrayIndex], previousNeurons);
      previousNeurons = hiddens[arrayIndex];
      this.layers.push(layer);
      index += 1;
    });

    layer = new Layer(index);
    layer.populate(output, previousNeurons);
    this.layers.push(layer);
  }

  getSave() {
    const data = {
      neurons: [],
      weights: [],
    };

    this.layers.forEach((layer) => {
      data.neurons.push(layer.neurons.length);
      layer.neurons.forEach((neuron) => {
        neuron.weights.forEach(weight => data.weights.push(weight));
      });
    });

    return data;
  }

  setSave(save) {
    let previousNeurons = 0;
    let index = 0;
    let indexWeights = 0;
    this.layers = [];

    save.neurons.forEach((neuron) => {
      const layer = new Layer(index);
      layer.populate(neuron, previousNeurons);

      layer.neurons.forEach((layerNeuron) => {
        layerNeuron.weights = layerNeuron.weights.map(() => {
          const ret = save.weights[indexWeights - 1];
          indexWeights += 1;
          return ret;
        });
      });

      previousNeurons = neuron;
      index += 1;
      this.layers.push(layer);
    });
  }

  compute(inputs) {
    inputs.forEach((input, index) => {
      if (this.layers[0] && this.layers[0].neurons[index]) {
        this.layers[0].neurons[index].value = input;
      }
    });

    let prevLayer = this.layers[0];
    const prevLayerNeuronsSize = prevLayer.neurons.length;
    function getPrevNeuronValueByIndex(k) {
      return prevLayer.neurons[k].value;
    }

    for (let i = 1; i < this.layers.length; i += 1) {
      this.layers[i].neurons.forEach((currentNeuron) => {
        let sum = 0;
        for(let k = 0; k < prevLayerNeuronsSize; k += 1) {
          sum += getPrevNeuronValueByIndex(k) * currentNeuron.weights[k];
        }
        currentNeuron.value = Network.activation(sum);
      });

      prevLayer = this.layers[i];
    }

    const out = [];
    const lastLayer = this.layers[this.layers.length - 1];
    lastLayer.neurons.forEach(neuron => out.push(neuron.value));
    return out;
  }

  static activation(a) {
    return (1 / (1 + Math.exp(-a)));
  }
}
