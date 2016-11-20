import Neuron from './neuron';

export default class Layer {
  constructor(index) {
    this.id = index || 0;
    this.neurons = [];
  }

  populate(nbNeurons, nbInputs) {
    this.neurons = [];
    for (let i = 0; i < nbNeurons; i += 1) {
      const neuron = new Neuron();
      neuron.populate(nbInputs);
      this.neurons.push(neuron);
    }
  }
}
