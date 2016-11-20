const Neuroevolution = function Neuroevolution(options) {
  const self = this;
  self.options = {
    randomClamped: () => (Math.random() * 2) - 1,
    population: 50,
    elitism: 0.2,
    randomBehaviour: 0.2,
    mutationRate: 0.1,
    mutationRange: 0.5,
    network: [1, [1], 1],
    historic: 0,
    lowHistoric: false,
    scoreSort: -1,
    nbChild: 1,
  };

  // Set options
  self.set = (setOptions) => {
    Object.keys(setOptions).forEach((key) => {
      if(self.options[key] !== undefined) self.options[key] = setOptions[key];
    });
    setOptions.forEach((val, index) => {
      self.options[index] = setOptions[index];
    });
  };

  self.set(options);

  // GENERATIONS
  const Generations = () => {
    this.generations = [];
    // const currentGeneration = new Generation();
  };

  Generations.prototype.firstGeneration = (/* input, hiddens, output */) => {
    const out = [];
    for (let i = 0; i < self.options.population; i += 1) {
      const nn = new Network();
      nn.perceptronGeneration(self.options.network[0], self.options.network[1], self.options.network[2]);
      out.push(nn.getSave());
    }
    this.generations.push(new Generation());
    return out;
  };

  Generations.prototype.nextGeneration = () => {
    if (this.generations.length === 0) {
      return false;
    }

    const gen = this.generations[this.generations.length - 1].generateNextGeneration();
    this.generations.push(new Generation());
    return gen;
  };


  Generations.prototype.addGenome = (genome) => {
    if (this.generations.length === 0) {
      return false;
    }

    return this.generations[this.generations.length - 1].addGenome(genome);
  };


  // SELF METHODS
  self.generations = new Generations();

  self.restart = () => {
    self.generations = new Generations();
  };

  self.nextGeneration = () => {
    let networks = [];
    if (self.generations.generations.length === 0) {
      networks = self.generations.firstGeneration();
    } else {
      networks = self.generations.nextGeneration();
    }
    const nns = [];
    networks.forEach((val, index) => {
      const nn = new Network();
      nn.setSave(networks[index]);
      nns.push(nn);
    });

    if (self.options.lowHistoric) {
      if (self.generations.generations.length >= 2) {
        const genomes = self.generations.generations[self.generations.generations.length - 2].genomes;
        genomes.forEach((val, index) => {
          delete genomes[index].network;
        });
      }
    }

    if (self.options.historic !== -1) {
      if (self.generations.generations.length > self.options.historic + 1) {
        self.generations.generations.splice(0, self.generations.generations.length - (self.options.historic + 1));
      }
    }
    return nns;
  };

  self.networkScore = (network, score) => {
    self.generations.addGenome(new Genome(score, network.getSave()));
  };
};

export default Neuroevolution;
