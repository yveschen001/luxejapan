// AutoClicker
// Copyright © 2024 Your Name. All rights reserved.
// Created by AI Assistant on 2024-05-02.

import AppKit
import SwiftUI

struct ImageMatchView: View {
    @StateObject private var viewModel = ImageMatchViewModel()
    
    var body: some View {
        VStack {
            if let image = viewModel.targetImage {
                Image(nsImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(maxWidth: 300, maxHeight: 300)
            } else {
                Text("未選擇目標圖片")
                    .foregroundColor(.gray)
            }
            
            HStack {
                Button("選擇圖片") {
                    viewModel.selectImage()
                }
                
                Button("開始匹配") {
                    viewModel.startMatching()
                }
                .disabled(viewModel.targetImage == nil)
            }
            .padding()
            
            if viewModel.isMatching {
                ProgressView("正在匹配...")
            }
            
            if let matchedPoint = viewModel.matchedPoint {
                Text("匹配位置：(\(Int(matchedPoint.x)), \(Int(matchedPoint.y)))")
            }
        }
        .padding()
        .alert("錯誤", isPresented: $viewModel.showError) {
            Button("確定", role: .cancel) {}
        } message: {
            Text(viewModel.errorMessage ?? "未知錯誤")
        }
    }
}

struct ImagePicker: NSViewControllerRepresentable {
    @Binding var image: CGImage?

    func makeNSViewController(context _: Context) -> NSViewController {
        let picker = NSOpenPanel()
        picker.allowsMultipleSelection = false
        picker.canChooseDirectories = false
        picker.canChooseFiles = true
        picker.allowedContentTypes = [.image]

        let viewController = NSViewController()
        viewController.view = NSView()

        if picker.runModal() == .OK {
            if let url = picker.url,
               let nsImage = NSImage(contentsOf: url),
               let cgImage = nsImage.cgImage(forProposedRect: nil, context: nil, hints: nil)
            {
                image = cgImage
            }
        }

        return viewController
    }

    func updateNSViewController(_: NSViewController, context _: Context) {}
}

struct TemplateImageView: View {
    let template: ImageTemplate

    var body: some View {
        VStack {
            Image(nsImage: template.image)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(height: 100)

            Text(template.name)
                .font(.caption)

            Text("間隔: \(template.interval)ms")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding()
        .background(Color(.windowBackgroundColor))
        .cornerRadius(8)
    }
}

#Preview {
    ImageMatchView()
}
