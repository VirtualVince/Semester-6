import SwiftUI

struct ContentView: View {
    @State private var count: Int = 0
    @State private var step: Int = 1

    var body: some View {
        VStack(spacing: 0) {
            // Title / Logo area
            Text("Lab Exercise")
                .font(.title)
                .fontWeight(.bold)
                .padding()
                .frame(maxWidth: .infinity)
                .overlay(
                    Rectangle()
                        .stroke(Color.black, lineWidth: 2)
                )
                .padding(.horizontal, 40)
                .padding(.bottom, 16)

            // Card
            VStack(spacing: 20) {
                // App Logo (system image as placeholder)
                Image(systemName: "graduationcap.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 100, height: 60)
                    .foregroundColor(.blue)
                    .padding(8)
                    .background(Color.white)
                    .cornerRadius(8)

                // Output box
                Text("\(count)")
                    .font(.largeTitle)
                    .fontWeight(.semibold)
                    .frame(width: 140, height: 50)
                    .background(Color.white)
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(Color.gray.opacity(0.5), lineWidth: 1)
                    )

                // Add / Subtract buttons
                HStack(spacing: 16) {
                    Button(action: {
                        count -= step
                    }) {
                        Text("−")
                            .font(.title)
                            .fontWeight(.bold)
                            .frame(width: 100, height: 50)
                            .background(Color.gray.opacity(0.6))
                            .foregroundColor(.white)
                            .cornerRadius(8)
                    }

                    Button(action: {
                        count += step
                    }) {
                        Text("+")
                            .font(.title)
                            .fontWeight(.bold)
                            .frame(width: 100, height: 50)
                            .background(Color.gray.opacity(0.6))
                            .foregroundColor(.white)
                            .cornerRadius(8)
                    }
                }

                // Reset / Step buttons
                HStack(spacing: 16) {
                    Button(action: {
                        count = 0
                    }) {
                        Text("Reset")
                            .fontWeight(.semibold)
                            .frame(width: 100, height: 44)
                            .background(Color.green)
                            .foregroundColor(.white)
                            .cornerRadius(8)
                    }

                    Button(action: {
                        step = (step == 1) ? 2 : 1
                    }) {
                        Text("Step = \(step)")
                            .fontWeight(.semibold)
                            .frame(width: 100, height: 44)
                            .background(Color.orange)
                            .foregroundColor(.white)
                            .cornerRadius(8)
                    }
                }
            }
            .padding(24)
            .background(Color(red: 1.0, green: 0.93, blue: 0.70))
            .cornerRadius(24)
            .padding(.horizontal, 40)
        }
        .padding(.top, 40)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .background(Color.white)
    }
}

#Preview {
    ContentView()
}
