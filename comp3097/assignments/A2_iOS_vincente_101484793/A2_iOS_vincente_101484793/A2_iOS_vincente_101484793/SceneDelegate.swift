//
//  SceneDelegate.swift
//  A2_iOS_vincente_101484793
//
//  Created by vs on 2026-04-09.
//

import UIKit
 
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
 
    var window: UIWindow?
 
    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }
 
        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = buildTabBarController()
        window?.makeKeyAndVisible()
    }
 
    // MARK: - Tab Bar Setup
 
    private func buildTabBarController() -> UITabBarController {
        let tabBar = UITabBarController()
 
        // Tab 1 – Browse
        let browseVC  = BrowseViewController()
        let browseNav = UINavigationController(rootViewController: browseVC)
        browseNav.tabBarItem = UITabBarItem(title: "Browse",
                                            image: UIImage(systemName: "doc.text.magnifyingglass"),
                                            tag: 0)
 
        // Tab 2 – All Products
        let listVC  = ProductListViewController()
        let listNav = UINavigationController(rootViewController: listVC)
        listNav.tabBarItem = UITabBarItem(title: "Products",
                                          image: UIImage(systemName: "list.bullet"),
                                          tag: 1)
 
        // Tab 3 – Search
        let searchVC  = SearchViewController()
        let searchNav = UINavigationController(rootViewController: searchVC)
        searchNav.tabBarItem = UITabBarItem(title: "Search",
                                            image: UIImage(systemName: "magnifyingglass"),
                                            tag: 2)
 
        // Tab 4 – Add Product
        let addVC  = AddProductViewController()
        let addNav = UINavigationController(rootViewController: addVC)
        addNav.tabBarItem = UITabBarItem(title: "Add",
                                         image: UIImage(systemName: "plus.circle"),
                                         tag: 3)
 
        tabBar.viewControllers = [browseNav, listNav, searchNav, addNav]
 
        // Style
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        tabBar.tabBar.standardAppearance  = appearance
        tabBar.tabBar.scrollEdgeAppearance = appearance
 
        return tabBar
    }
}
