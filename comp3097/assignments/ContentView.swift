import SwiftUI

struct ContentView: View {
    @State private var currentNumber: Int = Int.random(in: 1...100)
    @State private var correctAnswers: Int = 0
    @State private var wrongAnswers: Int = 0
    @State private var totalAttempts: Int = 0
    @State private var feedbackSymbol: String? = nil // "tick" or "cross"
    @State private var showDialog: Bool = false
    @State private var timeRemaining: Int = 5
    @State private var answered: Bool = false

    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        ZStack {
            Color.white.ignoresSafeArea()

            VStack(spacing: 40) {
                Spacer()

                // Current Number
                Text("\(currentNumber)")
                    .font(.system(size: 90, weight: .light, design: .serif))
                    .italic()
                    .foregroundColor(Color(red: 0.4, green: 0.7, blue: 0.7))

                // Timer indicator
                Text("Time: \(timeRemaining)s")
                    .font(.headline)
                    .foregroundColor(timeRemaining <= 2 ? .red : .gray)

                Spacer()

                // Prime Button
                Button(action: { handleAnswer(userSaysPrime: true) }) {
                    Text("Prime")
                        .font(.system(size: 36, weight: .light, design: .serif))
                        .italic()
                        .foregroundColor(Color(red: 0.4, green: 0.7, blue: 0.7))
                }
                .disabled(answered)

                // Not Prime Button
                Button(action: { handleAnswer(userSaysPrime: false) }) {
                    Text("non Prime")
                        .font(.system(size: 36, weight: .light, design: .serif))
                        .italic()
                        .foregroundColor(Color(red: 0.4, green: 0.7, blue: 0.7))
                }
                .disabled(answered)

                // Feedback symbol
                if let symbol = feedbackSymbol {
                    Image(systemName: symbol == "tick" ? "checkmark" : "xmark")
                        .font(.system(size: 60, weight: .bold))
                        .foregroundColor(symbol == "tick" ? .green : .red)
                        .transition(.scale)
                }

                Spacer()

                // Score display
                HStack {
                    Text("✓ \(correctAnswers)")
                        .foregroundColor(.green)
                        .font(.headline)
                    Spacer()
                    Text("✗ \(wrongAnswers)")
                        .foregroundColor(.red)
                        .font(.headline)
                }
                .padding(.horizontal, 40)
                .padding(.bottom, 20)
            }
        }
        .onReceive(timer) { _ in
            guard !showDialog else { return }

            if answered {
                // Brief pause after answer before next number
                return
            }

            if timeRemaining > 1 {
                timeRemaining -= 1
            } else {
                // Time's up — record wrong answer
                recordResult(correct: false)
                withAnimation { feedbackSymbol = "cross" }
                answered = true
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                    nextRound()
                }
            }
        }
        .alert("Results after 10 attempts", isPresented: $showDialog) {
            Button("OK") { showDialog = false }
        } message: {
            Text("Correct: \(correctAnswers)\nWrong: \(wrongAnswers)")
        }
    }

    // MARK: - Logic

    func isPrime(_ n: Int) -> Bool {
        if n < 2 { return false }
        if n == 2 { return true }
        if n % 2 == 0 { return false }
        for i in stride(from: 3, through: Int(Double(n).squareRoot()), by: 2) {
            if n % i == 0 { return false }
        }
        return true
    }

    func handleAnswer(userSaysPrime: Bool) {
        guard !answered else { return }
        let correct = isPrime(currentNumber) == userSaysPrime
        recordResult(correct: correct)
        withAnimation { feedbackSymbol = correct ? "tick" : "cross" }
        answered = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            nextRound()
        }
    }

    func recordResult(correct: Bool) {
        if correct {
            correctAnswers += 1
        } else {
            wrongAnswers += 1
        }
        totalAttempts += 1
    }

    func nextRound() {
        currentNumber = Int.random(in: 1...100)
        feedbackSymbol = nil
        answered = false
        timeRemaining = 5

        if totalAttempts % 10 == 0 && totalAttempts > 0 {
            showDialog = true
        }
    }
}

#Preview {
    ContentView()
}