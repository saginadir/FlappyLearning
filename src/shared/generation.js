export default class Generation {
  constructor(mutationRange) {
    this.genomes = [];
    this.mutationRange = mutationRange;
  }

  addGenome(genome) {
    let i;
    for (i = 0; i < this.genomes.length; i += 1) {
      if (self.options.scoreSort < 0) {
        if (genome.score > this.genomes[i].score) {
          break;
        }
      } else if(genome.score < this.genomes[i].score) {
        break;
      }
    }
    this.genomes.splice(i, 0, genome);
  }

  generateNextGeneration() {
    let nexts = [];

    for (let i = 0; i < Math.round(self.options.elitism * self.options.population); i++) {
      if (nexts.length < self.options.population) {
        nexts.push(JSON.parse(JSON.stringify(this.genomes[i].network)));
      }
    }

    for (let i = 0; i < Math.round(self.options.randomBehaviour * self.options.population); i++) {
      let n = JSON.parse(JSON.stringify(this.genomes[0].network));
      for (let k in n.weights) {
        n.weights[k] = self.options.randomClamped();
      }
      if (nexts.length < self.options.population) {
        nexts.push(n);
      }
    }

    let max = 0;
    let returnNexts;

    while (true) {
      for (let i = 0; i < max; i += 1) {
        const childs = Generation.breed(this.genomes[i], this.genomes[max], (self.options.nbChild > 0 ? self.options.nbChild : 1));
        childs.forEach((val, index) => {
          nexts.push(childs[index].network);
          if (nexts.length >= self.options.population) {
            returnNexts = nexts;
          }
        });
      }

      max += 1;
      if (max >= this.genomes.length - 1) {
        max = 0;
      }
    }
  }

  static breed(g1, g2, nbChilds) {
    const datas = [];
    for (let nb = 0; nb < nbChilds; nb += 1) {
      // const data = JSON.parse(JSON.stringify(g1));
      const data = g1;
      g2.network.weights.forEach((weight, i) => {
        if (Math.random() <= 0.5) {
          data.network.weights[i] = weight;
        }
      });

      data.network.weights.forEach((weight, i) => {
        if (Math.random() <= self.options.mutationRate) {
          data.network.weights[i] += Math.random() * self.options.mutationRange * 2 - self.options.mutationRange;
        }
      });

      datas.push(data);
    }

    return datas;
  }
}
