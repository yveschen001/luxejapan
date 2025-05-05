// MainView.swift
// 主視圖：包含腳本列表和操作按鈕
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 docs/UI_GUIDELINES.md 获取界面规范

import SwiftUI

struct MainView: View {
    @StateObject private var viewModel = MainViewModel()
    @State private var isShowingSettings = false

    var body: some View {
        NavigationView {
            VStack {
                List {
                    ForEach(viewModel.scripts) { script in
                        VStack(alignment: .leading) {
                            Text(script.name)
                                .font(.headline)
                            Text("動作數：\(script.actions.count)")
                                .font(.caption)
                            Text("重複次數：\(script.repeatCount)")
                                .font(.caption)
                        }
                        .contentShape(Rectangle())
                        .onTapGesture {
                            viewModel.selectScript(script)
                        }
                    }
                    .onDelete { indexSet in
                        Task {
                            for index in indexSet {
                                await viewModel.deleteScript(viewModel.scripts[index])
                            }
                        }
                    }
                }

                HStack {
                    Button(action: {
                        Task {
                            await viewModel.startRecording()
                        }
                    }) {
                        Image(systemName: "record.circle")
                        Text("錄製")
                    }
                    
                    Spacer()
                    
                    Button(action: {
                        Task {
                            await viewModel.stopRecording()
                        }
                    }) {
                        Image(systemName: "stop.circle")
                        Text("停止")
                    }
                }
                .padding()
            }
            .navigationTitle("自動點擊器")
            .toolbar {
                ToolbarItem(placement: .automatic) {
                    Button(action: {
                        isShowingSettings = true
                    }) {
                        Image(systemName: "gear")
                    }
                }
            }
            .sheet(isPresented: $isShowingSettings) {
                SettingsView()
            }
        }
        .alert("錯誤", isPresented: $viewModel.showError) {
            Button("確定", role: .cancel) {}
        } message: {
            Text(viewModel.errorMessage ?? "")
        }
    }
}

#Preview {
    MainView()
}
