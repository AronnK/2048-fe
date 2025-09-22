2048-AI: A Reinforcement Learning Agent
An attempt to solve the game of 2048 by building, training, and deploying a sophisticated Deep Reinforcement Learning agent from the ground up.

This project documents the entire journey of creating a high-performing AI for 2048, from foundational concepts like DQN to an "Apex" agent combining Double Dueling DQN, Prioritized Experience Replay, and advanced training techniques. The final model is deployed to run entirely in the user's browser using ONNX.

🚀 Live Demo
Experience the AI in action! The final trained model is running entirely on the client-side.

https://2048-fe.vercel.app/

(Click "Start AI" to watch him play, but wait for him. It’s hard for him to perform under pressure.)

📋 Table of Contents

1. About The Project
2. Key Features
3. Tech Stack
4. The Journey: A Developer's Log
5. Final Architecture Deep Dive
6. Key Learnings & Takeaways
7. Getting Started
8. Future Work

---

1. 📖 About The Project  
   The goal was to tackle a problem with a vast state space and a need for long-term planning: the game of 2048. This isn't just about making merges; it's about learning complex spatial strategies to build high-value tiles.

After extensive experimentation with over half a dozen different architectures and hundreds of thousands of training episodes, the final agent demonstrates a solid understanding of the game's core strategies.

Current Performance:

Reaches 1024 Tile: ~20% of games
Reaches 512 Tile: ~50% of games
Below 512: ~30% of games

This project is a deep dive into the practical realities of building a modern RL agent, including the critical role of reward shaping, the challenges of hyperparameter tuning, and the process of deploying a model for a real-world application.

2. ✨ Key Features

a. Advanced RL Agent: Implements a Double Dueling Deep Q-Network (DDQN) for stable and effective learning.
b. Efficient Training: Utilizes Prioritized Experience Replay (PER) with a SumTree to focus training on the most impactful game states.
c. Intelligent Training Loop: Incorporates automatic learning rate scheduling (ReduceLROnPlateau) and epsilon "spiking" to escape performance plateaus.
d. Client-Side Inference: The final PyTorch model is converted to ONNX and runs directly in the user's browser using onnxruntime-web, e. resulting in zero server costs and instantaneous AI moves.
e. Full Deployment Pipeline: Includes a complete workflow for training (PyTorch), conversion (ONNX), and deployment (Next.js on Vercel).

3. 🛠️ Tech Stack

AI Training: Python, PyTorch, Gymnasium
Frontend: Next.js, React, TypeScript, Tailwind CSS
Deployment: Vercel (Frontend), ONNX Runtime (Client-Side Inference)

4. 🎢 The Journey: A Developer's Log

This project was a marathon of trial, error, and discovery. My notes tell the story best:
From Simple Models to DDQN
I started with simpler RL environments like CartPole and Frozen Lake before tackling 2048. My first attempt used a vanilla DQN, but I quickly hit a wall. The breakthrough came when I implemented Double DQN (DDQN).

"Okay so wayyy better results... In DQN the targ_net itself chose the next best action and evaluated itself... positive bias... In DDQN, q_net is the one choosing the action and sending it to targ_net to evaluate... the more stable targ_net would make the correct estimations."

The Reward Shaping Trap
My biggest challenge and most valuable lesson was in reward shaping. Eager to improve performance, I engineered a complex reward function with multiple heuristics. The result? Catastrophic failure.

"The model just collapsed with this complicated reward function... And now Gemini is telling me that 'Yes your reward shaping is too complex...' Like bro I asked you if it was good and you buttered me up... Urgh... Gotta teach it only the most important stuff."

This was a critical turning point. I learned that a simpler, potential-based reward that guides the agent toward good states (like keeping the max tile in a corner and maintaining empty tiles) is far more effective than trying to micromanage every decision.

The Architecture Maze & The Plateau
I experimented with at least 8-10 different CNN architectures, training each for 20-30k episodes. After finding a stable architecture and reward function, I trained for over 35,000 episodes and hit another wall.

"After around 35k training episodes I feel like my model has reached a plateau... The current best can reach 1024 10% of the time, 512... 80% of the time... Gonna try to run another 5k episodes with 0.4 epsilon and 1e-4 learning rate... Also I'm gonna try to pair this current best model with a ExpectiMax algorithm."

This led me to implement more advanced techniques like epsilon spiking to break out of local optima, which proved effective.

The Pivot to Client-Side AI
Initially, I deployed the model on a Python backend server. However, the performance on free tiers was slow, with timeouts and memory issues. This led to the final strategic decision: convert the model to ONNX and run it entirely in the browser. This eliminated the need for a backend, made the AI's moves instantaneous, and resulted in a much cleaner, more modern application.

5. 🧠 Final Architecture Deep Dive

The final agent is a combination of several state-of-the-art components that work in concert.
Input Representation: The 4x4 game board is converted into a single-channel [1, 4, 4] tensor where each cell contains the log2 of the tile value. This helps normalize the tile values for the network.
Core Algorithm: Double Dueling DQN (DDQN) is used to learn the Q-values for each action.
Experience Replay: Prioritized Experience Replay (PER) ensures the agent learns from its most "surprising" experiences, dramatically improving sample efficiency.
Network Architecture: A custom Dueling CNN processes the board state.

6. 🎓 Key Learnings & Takeaways

This project was a deep dive into the practical side of Reinforcement Learning. My key takeaways were:
Foundational Concepts: Gained a deep, practical understanding of DQN, Double DQN, Dueling architectures, and the critical role of memory vs. Prioritized Experience Replay (PER).
Reward Shaping is an Art: Realized that less is more. Overly complex reward functions can confuse an agent and destroy performance. The best rewards gently guide the agent without being too prescriptive.
The Power of Experimentation: There is no "one size fits all" solution. I developed a strong intuition for hyperparameter tuning and architecture design through rigorous, iterative experimentation.
Client-Side ML is Viable: Discovered the power of the ONNX ecosystem for deploying PyTorch models directly in the browser, eliminating server costs and creating a faster user experience.
Patience is a Hyperparameter: RL is not a straight line. Progress involves long plateaus and sudden breakthroughs. Trusting the process and training for hundreds of thousands of steps is essential.

7. 🚀 Getting Started

To get the project running locally, you only need the frontend.
Clone the repository:
git clone [https://github.com/your-username/2048-fe.git](https://github.com/your-username/2048-fe.git)
Navigate to the frontend directory:

cd 2048-fe

Install NPM packages:

npm install

Run the development server:

npm run dev

Open http://localhost:3000 in your browser.

8. 🔮 Future Work

While I'm proud of the current agent's performance, the journey isn't over.

Reach the 2048 Tile: The ultimate goal is to train an agent that can consistently reach the 2048 tile. This will likely require a much longer training run (500k+ episodes) and further refinement of the reward function.

Explore More Advanced Architectures: Experiment with deeper ResNet-style architectures to see if a higher-capacity model can learn more nuanced strategies.

Fine-tune Hyperparameters: Conduct a more systematic search for the optimal learning rate, discount factor, and PER parameters.

PS: It didn't occur to me to visualize the training metrics, so forgive the lack of graphs which is kinda the most important part of an AI model... Will include them for future trainings😤👍🏽
