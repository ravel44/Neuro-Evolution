// neural network library created by Daniel Shiffman and modified by Pascal Guyon

class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);

let tanh = new ActivationFunction(
  x => Math.tanh(x),
  y => 1 - (y * y)
);

class NeuralNetwork {
    constructor(in_nodes, hid_nodes, out_nodes, dna) {
		this.input_nodes = in_nodes;
		this.hidden_nodes = hid_nodes;
		this.output_nodes = out_nodes;

		this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes); 
		this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes); 
		this.bias_h = new Matrix(this.hidden_nodes, 1); 
		this.bias_o = new Matrix(this.output_nodes, 1); 

//part added by Pascal Guyon=======================================================================================================
		if(dna){ //dna is an array			
		//breaking down dna array to transform different parts in matrices
			var numberWeights_ih= this.hidden_nodes*this.input_nodes; 
			var numberWeights_ho= this.output_nodes*this.hidden_nodes;
			var numberWeights_bh= this.hidden_nodes; 
			var numberWeights_bo= this.output_nodes; 
			var a= dna.slice(0, numberWeights_ih) ; 
			var b= dna.slice(numberWeights_ih, numberWeights_ih+numberWeights_ho) ; 
			var c= dna.slice(numberWeights_ih+numberWeights_ho, numberWeights_ih+numberWeights_ho+this.hidden_nodes ); 
			var d= dna.slice(numberWeights_ih+numberWeights_ho + this.hidden_nodes, numberWeights_ih+numberWeights_ho + this.hidden_nodes+this.output_nodes); 
			
			fillMatrix(this.weights_ih, this.hidden_nodes, this.input_nodes, a );
			fillMatrix(this.weights_ho,this.output_nodes, this.hidden_nodes, b );
			fillMatrix(this.bias_h, this.hidden_nodes, 1, c);
			fillMatrix(this.bias_h, this.output_nodes, 1, d);
				
		}else{ //no dna given at 1st: random initialization of the weights
			this.weights_ih.randomize(); 
			this.weights_ho.randomize(); 
			this.bias_h.randomize();
			this.bias_o.randomize();
		}
		this.dna=[...this.weights_ih.toArray(), ...this.weights_ho.toArray(), ...this.bias_h.toArray(), ...this.bias_o.toArray()] ;
//=================================================================================================================================	
		
		this.setLearningRate();
		this.setActivationFunction();
    }

  predict(input_array) {

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);  
    let hidden = Matrix.multiply(this.weights_ih, inputs); 
    hidden.add(this.bias_h);
    hidden.map(this.activation_function.func);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(this.activation_function.func);

    // Sending back to the caller!
    return output.toArray();
  }

  setLearningRate(learning_rate = 0.1) {
    this.learning_rate = learning_rate;
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  train(input_array, target_array) {
    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // activation function!
    hidden.map(this.activation_function.func);

    // Generating the output's output!
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(this.activation_function.func);

    // Convert array to matrix object
    let targets = Matrix.fromArray(target_array);

    // ERROR = TARGETS - OUTPUTS
    let output_errors = Matrix.subtract(targets, outputs);

    // let gradient = outputs * (1 - outputs);
    // Calculate gradient
    let gradients = Matrix.map(outputs, this.activation_function.dfunc);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);

    // Calculate deltas
    let hidden_T = Matrix.transpose(hidden);
    let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

    // Adjust the weights by deltas
    this.weights_ho.add(weight_ho_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_o.add(gradients);

    // Calculate the hidden layer errors
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors);

    // Calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden, this.activation_function.dfunc);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);

    // Calcuate input->hidden deltas
    let inputs_T = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

    this.weights_ih.add(weight_ih_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_h.add(hidden_gradient);
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h = Matrix.deserialize(data.bias_h);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    nn.learning_rate = data.learning_rate;
    return nn;
  }

  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  // Accept an arbitrary function for mutation
  mutate(func) {
    this.weights_ih.map(func);
    this.weights_ho.map(func);
    this.bias_h.map(func);
    this.bias_o.map(func);
  }
	
}
