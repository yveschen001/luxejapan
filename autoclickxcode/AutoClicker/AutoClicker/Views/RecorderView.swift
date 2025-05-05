// RecorderView.swift
// 錄製視圖：用於錄製滑鼠和鍵盤動作
// AutoClicker
// Created by AI Assistant on 2024-05-02
// 参见 docs/UI_GUIDELINES.md 获取界面規範

import SwiftUI

struct RecorderView: View {
    @StateObject private var viewModel = RecorderViewModel()

    var body: some View {
        VStack {
            // 錄製狀態
            HStack {
                Image(systemName: viewModel.isRecording ? "record.circle.fill" : "record.circle")
                    .foregroundColor(viewModel.isRecording ? .red : .gray)
                Text(viewModel.isRecording ? "正在錄製..." : "未錄製")
                    .foregroundColor(viewModel.isRecording ? .red : .gray)
            }
            .padding()

            // 錄製動作列表
            List {
                ForEach(Array(viewModel.recordedActions.enumerated()), id: \.offset) { idx, action in
                    HStack {
                        Text("動作：\(action.type.rawValue)")
                        Spacer()
                        if let duration = action.duration {
                            Text("延遲：\(String(format: "%.2f", duration))s")
                        }
                    }
                }
            }

            // 操作按鈕
            HStack {
                Button(action: {
                    viewModel.startRecording()
                }) {
                    Image(systemName: "record.circle")
                    Text("開始錄製")
                }
                .disabled(viewModel.isRecording)

                Spacer()

                Button(action: {
                    Task {
                        await viewModel.stopRecording()
                    }
                }) {
                    Image(systemName: "stop.circle")
                    Text("停止錄製")
                }
                .disabled(!viewModel.isRecording)
            }
            .padding()

            // 日誌顯示
            ScrollView {
                VStack(alignment: .leading) {
                    ForEach(viewModel.logMessages, id: \.self) { message in
                        Text(message)
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                }
            }
            .frame(height: 100)
            .padding()
        }
    }
}

struct RecorderView_Previews: PreviewProvider {
    static var previews: some View {
        RecorderView()
    }
}
