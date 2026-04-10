//
//  Browseviewcontroller.swift
//  A2_iOS_vincente_101484793
//
//  Created by vs on 2026-04-09.
//

import UIKit
import CoreData
 
class BrowseViewController: UIViewController {
 
    // MARK: - Data
 
    private var products: [Product] = []
    private var currentIndex: Int = 0
 
    // MARK: - UI Components
 
    private let cardView: UIView = {
        let v = UIView()
        v.backgroundColor = .secondarySystemBackground
        v.layer.cornerRadius = 16
        v.layer.shadowColor = UIColor.black.cgColor
        v.layer.shadowOpacity = 0.08
        v.layer.shadowOffset = CGSize(width: 0, height: 4)
        v.layer.shadowRadius = 8
        v.translatesAutoresizingMaskIntoConstraints = false
        return v
    }()
 
    private let idLabel     = BrowseViewController.makeLabel(font: .systemFont(ofSize: 13, weight: .medium),
                                                             color: .secondaryLabel)
    private let nameLabel   = BrowseViewController.makeLabel(font: .systemFont(ofSize: 22, weight: .bold),
                                                             color: .label, lines: 2)
    private let priceLabel  = BrowseViewController.makeLabel(font: .systemFont(ofSize: 20, weight: .semibold),
                                                             color: .systemGreen)
    private let providerLabel = BrowseViewController.makeLabel(font: .systemFont(ofSize: 15, weight: .regular),
                                                               color: .secondaryLabel)
    private let descLabel   = BrowseViewController.makeLabel(font: .systemFont(ofSize: 15),
                                                             color: .label, lines: 0)
 
    private let prevButton: UIButton = {
        var config = UIButton.Configuration.filled()
        config.title        = "← Prev"
        config.cornerStyle  = .capsule
        config.baseBackgroundColor = .systemBlue
        let b = UIButton(configuration: config)
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
    }()
 
    private let nextButton: UIButton = {
        var config = UIButton.Configuration.filled()
        config.title        = "Next →"
        config.cornerStyle  = .capsule
        config.baseBackgroundColor = .systemBlue
        let b = UIButton(configuration: config)
        b.translatesAutoresizingMaskIntoConstraints = false
        return b
    }()
 
    private let counterLabel: UILabel = {
        let l = UILabel()
        l.font = .systemFont(ofSize: 14, weight: .medium)
        l.textColor = .secondaryLabel
        l.textAlignment = .center
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
 
    // MARK: - Lifecycle
 
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Browse Products"
        view.backgroundColor = .systemBackground
        setupUI()
    }
 
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        fetchProducts()
    }
 
    // MARK: - Core Data Fetch
 
    private func fetchProducts() {
        let request: NSFetchRequest<Product> = Product.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(key: "productID", ascending: true)]
        do {
            products = try CoreDataStack.shared.context.fetch(request)
            if currentIndex >= products.count { currentIndex = 0 }
            updateUI()
        } catch {
            print("Fetch error: \(error)")
        }
    }
 
    // MARK: - UI Updates
 
    private func updateUI() {
        guard !products.isEmpty else {
            nameLabel.text = "No products found."
            [idLabel, priceLabel, providerLabel, descLabel].forEach { $0.text = "" }
            prevButton.isEnabled = false
            nextButton.isEnabled = false
            counterLabel.text = "0 / 0"
            return
        }
 
        let p = products[currentIndex]
        idLabel.text       = "Product ID: \(p.productID)"
        nameLabel.text     = p.displayName
        priceLabel.text    = p.displayPrice
        providerLabel.text = "By \(p.displayProvider)"
        descLabel.text     = p.displayDescription
 
        prevButton.isEnabled = currentIndex > 0
        nextButton.isEnabled = currentIndex < products.count - 1
        counterLabel.text    = "\(currentIndex + 1) of \(products.count)"
    }
 
    // MARK: - Actions
 
    @objc private func prevTapped() {
        guard currentIndex > 0 else { return }
        currentIndex -= 1
        animateTransition(direction: .right)
        updateUI()
    }
 
    @objc private func nextTapped() {
        guard currentIndex < products.count - 1 else { return }
        currentIndex += 1
        animateTransition(direction: .left)
        updateUI()
    }
 
    private func animateTransition(direction: UIRectEdge) {
        let offset: CGFloat = direction == .left ? 60 : -60
        cardView.transform = CGAffineTransform(translationX: offset, y: 0)
        cardView.alpha = 0
        UIView.animate(withDuration: 0.25) {
            self.cardView.transform = .identity
            self.cardView.alpha = 1
        }
    }
 
    // MARK: - Layout
 
    private func setupUI() {
        prevButton.addTarget(self, action: #selector(prevTapped), for: .touchUpInside)
        nextButton.addTarget(self, action: #selector(nextTapped), for: .touchUpInside)
 
        let stack = UIStackView(arrangedSubviews: [idLabel, nameLabel, priceLabel, providerLabel,
                                                   makeSeparator(), descLabel])
        stack.axis = .vertical
        stack.spacing = 10
        stack.translatesAutoresizingMaskIntoConstraints = false
 
        cardView.addSubview(stack)
        view.addSubview(cardView)
        view.addSubview(prevButton)
        view.addSubview(nextButton)
        view.addSubview(counterLabel)
 
        NSLayoutConstraint.activate([
            cardView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 24),
            cardView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            cardView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
 
            stack.topAnchor.constraint(equalTo: cardView.topAnchor, constant: 20),
            stack.leadingAnchor.constraint(equalTo: cardView.leadingAnchor, constant: 20),
            stack.trailingAnchor.constraint(equalTo: cardView.trailingAnchor, constant: -20),
            stack.bottomAnchor.constraint(equalTo: cardView.bottomAnchor, constant: -20),
 
            counterLabel.topAnchor.constraint(equalTo: cardView.bottomAnchor, constant: 24),
            counterLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
 
            prevButton.topAnchor.constraint(equalTo: counterLabel.bottomAnchor, constant: 16),
            prevButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 32),
            prevButton.widthAnchor.constraint(equalToConstant: 120),
            prevButton.heightAnchor.constraint(equalToConstant: 44),
 
            nextButton.topAnchor.constraint(equalTo: counterLabel.bottomAnchor, constant: 16),
            nextButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -32),
            nextButton.widthAnchor.constraint(equalToConstant: 120),
            nextButton.heightAnchor.constraint(equalToConstant: 44)
        ])
    }
 
    // MARK: - Helpers
 
    private static func makeLabel(font: UIFont, color: UIColor = .label, lines: Int = 1) -> UILabel {
        let l = UILabel()
        l.font = font
        l.textColor = color
        l.numberOfLines = lines
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }
 
    private func makeSeparator() -> UIView {
        let v = UIView()
        v.backgroundColor = .separator
        v.translatesAutoresizingMaskIntoConstraints = false
        v.heightAnchor.constraint(equalToConstant: 1).isActive = true
        return v
    }
}
