//
//  ProductDetailViewController.swift
//  A2_iOS_vincente_101484793
//
//  Created by vs on 2026-04-09.
//

import UIKit
 
class ProductDetailViewController: UIViewController {
 
    // MARK: - Data
 
    private let product: Product
 
    init(product: Product) {
        self.product = product
        super.init(nibName: nil, bundle: nil)
    }
    required init?(coder: NSCoder) { fatalError() }
 
    // MARK: - Lifecycle
 
    override func viewDidLoad() {
        super.viewDidLoad()
        title = product.displayName
        view.backgroundColor = .systemBackground
        setupUI()
    }
 
    // MARK: - Layout
 
    private func setupUI() {
        let scrollView = UIScrollView()
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
 
        let container = UIView()
        container.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(container)
 
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
 
            container.topAnchor.constraint(equalTo: scrollView.topAnchor),
            container.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            container.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            container.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            container.widthAnchor.constraint(equalTo: scrollView.widthAnchor)
        ])
 
        let rows: [(String, String)] = [
            ("Product ID",    "\(product.productID)"),
            ("Name",          product.displayName),
            ("Price",         product.displayPrice),
            ("Provider",      product.displayProvider),
            ("Description",   product.displayDescription)
        ]
 
        let stack = UIStackView()
        stack.axis = .vertical
        stack.spacing = 0
        stack.translatesAutoresizingMaskIntoConstraints = false
 
        for (label, value) in rows {
            stack.addArrangedSubview(makeRow(label: label, value: value))
            let sep = UIView()
            sep.backgroundColor = .separator
            sep.heightAnchor.constraint(equalToConstant: 0.5).isActive = true
            stack.addArrangedSubview(sep)
        }
 
        container.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.topAnchor.constraint(equalTo: container.topAnchor, constant: 24),
            stack.leadingAnchor.constraint(equalTo: container.leadingAnchor, constant: 20),
            stack.trailingAnchor.constraint(equalTo: container.trailingAnchor, constant: -20),
            stack.bottomAnchor.constraint(lessThanOrEqualTo: container.bottomAnchor, constant: -24)
        ])
    }
 
    private func makeRow(label: String, value: String) -> UIView {
        let row = UIView()
        row.translatesAutoresizingMaskIntoConstraints = false
 
        let keyLabel = UILabel()
        keyLabel.text = label
        keyLabel.font = .systemFont(ofSize: 13, weight: .medium)
        keyLabel.textColor = .secondaryLabel
        keyLabel.translatesAutoresizingMaskIntoConstraints = false
 
        let valueLabel = UILabel()
        valueLabel.text = value
        valueLabel.font = .systemFont(ofSize: 16)
        valueLabel.textColor = .label
        valueLabel.numberOfLines = 0
        valueLabel.translatesAutoresizingMaskIntoConstraints = false
 
        let col = UIStackView(arrangedSubviews: [keyLabel, valueLabel])
        col.axis = .vertical
        col.spacing = 4
        col.translatesAutoresizingMaskIntoConstraints = false
 
        row.addSubview(col)
        NSLayoutConstraint.activate([
            col.topAnchor.constraint(equalTo: row.topAnchor, constant: 12),
            col.leadingAnchor.constraint(equalTo: row.leadingAnchor),
            col.trailingAnchor.constraint(equalTo: row.trailingAnchor),
            col.bottomAnchor.constraint(equalTo: row.bottomAnchor, constant: -12)
        ])
 
        return row
    }
}
