export default class Neuron {
  constructor() {
    this.value = 0;
    this.weights = [];
  }

  populate(nb) {
    this.weights = [];
    for (let i = 0; i < nb; i += 1) {
      this.weights.push(self.options.randomClamped());
    }
  }
}
