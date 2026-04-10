//
//  SearchViewController.swift
//  A2_iOS_vincente_101484793
//
//  Created by vs on 2026-04-09.
//

import UIKit
import CoreData
 
class SearchViewController: UIViewController {
 
    // MARK: - Data
 
    private var allProducts: [Product]      = []
    private var filteredProducts: [Product] = []
    private var isSearching: Bool { !(searchBar.text?.isEmpty ?? true) }
 
    // MARK: - UI
 
    private let searchBar: UISearchBar = {
        let sb = UISearchBar()
        sb.placeholder = "Search by name or description…"
        sb.searchBarStyle = .minimal
        sb.translatesAutoresizingMaskIntoConstraints = false
        return sb
    }()
 
    private let tableView: UITableView = {
        let tv = UITableView(frame: .zero, style: .plain)
        tv.register(ProductCell.self, forCellReuseIdentifier: ProductCell.reuseID)
        tv.rowHeight = UITableView.automaticDimension
        tv.estimatedRowHeight = 80
        tv.translatesAutoresizingMaskIntoConstraints = false
        return tv
    }()
 
    private let emptyLabel: UILabel = {
        let l = UILabel()
        l.text = "No products match your search."
        l.textColor = .secondaryLabel
        l.font = .systemFont(ofSize: 16)
        l.textAlignment = .center
        l.isHidden = true
        l.translatesAutoresizingMaskIntoConstraints = false
        return l
    }()
 
    // MARK: - Lifecycle
 
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Search"
        view.backgroundColor = .systemBackground
        setupUI()
    }
 
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        fetchAllProducts()
        tableView.reloadData()
    }
 
    // MARK: - Core Data
 
    private func fetchAllProducts() {
        let request: NSFetchRequest<Product> = Product.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(key: "name", ascending: true)]
        allProducts     = (try? CoreDataStack.shared.context.fetch(request)) ?? []
        filteredProducts = allProducts
    }
 
    private func filterProducts(query: String) {
        let q = query.lowercased()
        filteredProducts = allProducts.filter {
            ($0.name?.lowercased().contains(q) ?? false) ||
            ($0.productDescription?.lowercased().contains(q) ?? false)
        }
        emptyLabel.isHidden = !filteredProducts.isEmpty || q.isEmpty
        tableView.reloadData()
    }
 
    // MARK: - Layout
 
    private func setupUI() {
        searchBar.delegate  = self
        tableView.dataSource = self
        tableView.delegate   = self
 
        view.addSubview(searchBar)
        view.addSubview(tableView)
        view.addSubview(emptyLabel)
 
        NSLayoutConstraint.activate([
            searchBar.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            searchBar.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 8),
            searchBar.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -8),
 
            tableView.topAnchor.constraint(equalTo: searchBar.bottomAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
 
            emptyLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            emptyLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}
 
// MARK: - UISearchBarDelegate
 
extension SearchViewController: UISearchBarDelegate {
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        if searchText.isEmpty {
            filteredProducts = allProducts
            emptyLabel.isHidden = true
            tableView.reloadData()
        } else {
            filterProducts(query: searchText)
        }
    }
 
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        searchBar.resignFirstResponder()
    }
}
 
// MARK: - UITableViewDataSource & Delegate
 
extension SearchViewController: UITableViewDataSource, UITableViewDelegate {
 
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        filteredProducts.count
    }
 
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: ProductCell.reuseID, for: indexPath) as! ProductCell
        cell.configure(with: filteredProducts[indexPath.row])
        return cell
    }
 
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        searchBar.resignFirstResponder()
        let detailVC = ProductDetailViewController(product: filteredProducts[indexPath.row])
        navigationController?.pushViewController(detailVC, animated: true)
    }
}
