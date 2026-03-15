import SwiftUI

struct HomeScreen: View {
    @State private var path = NavigationPath()
    
    let books = [
        "The Swift Programming Language",
        "Clean Code",
        "Design Patterns",
        "The Pragmatic Programmer",
        "iOS Programming: The Big Nerd Ranch Guide"
    ]
    
    var body: some View {
        NavigationStack(path: $path) {
            List(books, id: \.self) { book in
                NavigationLink(book, value: book)
            }
            .navigationTitle("Book Library")
            .navigationDestination(for: String.self) { book in
                DetailScreen(title: book, path: $path)
            }
        }
    }
}

struct DetailScreen: View {
    let title: String
    @Binding var path: NavigationPath
    
    var body: some View {
        VStack(spacing: 20) {
            Text(title)
                .font(.title2)
                .fontWeight(.semibold)
                .multilineTextAlignment(.center)
                .padding()
            
            NavigationLink("Learn More") {
                InfoScreen(path: $path)
            }
            .buttonStyle(.borderedProminent)
        }
        .navigationTitle("Book Detail")
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct InfoScreen: View {
    @Binding var path: NavigationPath
    
    var body: some View {
        VStack(spacing: 20) {
            Text("About")
                .font(.title)
                .fontWeight(.bold)
            
            Text("This app is a demo library browser. It should demonstrates NavigationStack, NavigationLink, and passing data between screens.")
                .multilineTextAlignment(.center)
                .padding()
            
            Button("Go Back to Home") {
                path.removeLast(path.count) 
            }
            .buttonStyle(.borderedProminent)
        }
        .navigationTitle("Info")
        .navigationBarTitleDisplayMode(.inline)
        .padding()
    }
}

@main
struct BookAppApp: App {
    var body: some Scene {
        WindowGroup {
            HomeScreen()
        }
    }
}