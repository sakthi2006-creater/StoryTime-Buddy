export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export const STORY_TEXT =
  "Once upon a time, a clever little robot named Pip lost his shiny blue gear in the Whispering Woods. He searched under mushrooms, behind singing flowers, and beside a sleepy turtle, until at last a friendly firefly lit the path and helped Pip find his sparkling blue gear again.";

export const QUIZ: QuizQuestion[] = [
  {
    question: "What colour was Pip the Robot's lost gear?",
    options: ["Red", "Green", "Blue", "Yellow"],
    answer: "Blue",
  },
];
