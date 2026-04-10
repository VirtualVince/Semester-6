//
//  ProductListViewController.swift
//  A2_iOS_vincente_101484793
//
//  Created by vs on 2026-04-09.
//

import UIKit
import CoreData
 
class ProductListViewController: UIViewController {
 
    // MARK: - Data
 
    private var products: [Product] = []
 
    // MARK: - UI
 
    private let tableView: UITableView = {
        let tv = UITableView(frame: .zero, style: .insetGrouped)
        tv.register(ProductCell.self, forCellReuseIdentifier: ProductCell.reuseID)
        tv.rowHeight = UITableView.automaticDimension
        tv.estimatedRowHeight = 80
        tv.translatesAutoresizingMaskIntoConstraints = false
        return tv
    }()
 
    // MARK: - Lifecycle
 
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "All Products"
        view.backgroundColor = .systemBackground
        setupTableView()
    }
 
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        fetchProducts()
        tableView.reloadData()
    }
 
    // MARK: - Core Data
 
    private func fetchProducts() {
        let request: NSFetchRequest<Product> = Product.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(key: "productID", ascending: true)]
        products = (try? CoreDataStack.shared.context.fetch(request)) ?? []
    }
 
    // MARK: - Setup
 
    private func setupTableView() {
        tableView.dataSource = self
        tableView.delegate   = self
        view.addSubview(tableView)
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
}
 
// MARK: - UITableViewDataSource & Delegate
 
extension ProductListViewController: UITableViewDataSource, UITableViewDelegate {
 
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        products.count
    }
 
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ProductCell.reuseID, for: indexPath) as! ProductCell
        cell.configure(with: products[indexPath.row])
        return cell
    }
 
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let detailVC = ProductDetailViewController(product: products[indexPath.row])
        navigationController?.pushViewController(detailVC, animated: true)
    }
 
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        "\(products.count) product\(products.count == 1 ? "" : "s")"
    }
}
 
// MARK: - ProductCell
 
class ProductCell: UITableViewCell {
    static let reuseID = "ProductCell"
 
    private let nameLabel: UILabel = {
        let l = UILabel()
        l.font = .systemFont(ofSize: 16, weight: .semibold)
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
 
    private let descLabel: UILabel = {
        let l = UILabel()
        l.font = .systemFont(ofSize: 13)
        l.textColor = .secondaryLabel
        l.numberOfLines = 2
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
 
    private let priceLabel: UILabel = {
        let l = UILabel()
        l.font = .systemFont(ofSize: 14, weight: .medium)
        l.textColor = .systemGreen
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
 
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        accessoryType = .disclosureIndicator
        let stack = UIStackView(arrangedSubviews: [nameLabel, descLabel, priceLabel])
        stack.axis = .vertical
        stack.spacing = 4
        stack.translatesAutoresizingMaskIntoConstraints = false
        contentView.addSubview(stack)
        NSLayoutConstraint.activate([
            stack.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 12),
            stack.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 16),
            stack.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -16),
            stack.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -12)
        ])
    }
 
    required init?(coder: NSCoder) { fatalError() }
 
    func configure(with product: Product) {
        nameLabel.text  = product.displayName
        descLabel.text  = product.displayDescription
        priceLabel.text = product.displayPrice
    }
}
