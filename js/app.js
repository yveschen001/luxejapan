function app() {
    return {
        currentPage: 'home',
        showGiftOverlay: false,
        hasUncompletedTasks: true,
        
        // 模拟数据
        recentMatches: [
            {
                id: 1,
                name: "Sarah",
                mbti: "INFJ",
                avatar: "https://i.pravatar.cc/150?img=1"
            },
            {
                id: 2,
                name: "Mike",
                mbti: "ENTJ",
                avatar: "https://i.pravatar.cc/150?img=2"
            },
            {
                id: 3,
                name: "Emma",
                mbti: "ISFP",
                avatar: "https://i.pravatar.cc/150?img=3"
            }
        ],
        
        gifts: [
            { id: 1, emoji: "🌹", name: "玫瑰", price: 10 },
            { id: 2, emoji: "🎂", name: "蛋糕", price: 20 },
            { id: 3, emoji: "💝", name: "礼物", price: 30 },
            { id: 4, emoji: "👑", name: "皇冠", price: 50 },
            { id: 5, emoji: "🎁", name: "精美礼盒", price: 150 },
            { id: 6, emoji: "🚗", name: "跑车", price: 300 }
        ],
        
        selectGift(gift) {
            // 模拟送礼物
            alert(`已送出 ${gift.emoji} ${gift.name}，扣除 ${gift.price} 金币`);
            this.showGiftOverlay = false;
        },

        chatSearch: '',
        currentChat: null,
        newMessage: '',
        userCoins: 100,

        // 模拟聊天数据
        chats: [
            {
                id: 1,
                name: "Sarah",
                avatar: "https://i.pravatar.cc/150?img=1",
                lastMessage: "好的,下次见! 👋",
                lastTime: "14:30",
                unread: 2,
                isMutual: true,
                messages: [
                    {id: 1, text: "你好!", time: "14:20", sent: false},
                    {id: 2, text: "最近怎么样?", time: "14:25", sent: true},
                    {id: 3, text: "还不错,你呢?", time: "14:28", sent: false},
                    {id: 4, text: "好的,下次见! 👋", time: "14:30", sent: false}
                ]
            },
            // 添加更多模拟聊天...
        ],

        // 计算属性
        get filteredChats() {
            return this.chats.filter(chat => 
                chat.name.toLowerCase().includes(this.chatSearch.toLowerCase())
            );
        },

        // 方法
        openChat(chat) {
            this.currentChat = chat;
            this.currentPage = 'chatDetail';
            // 滚动到最新消息
            this.$nextTick(() => {
                const container = this.$refs.messageContainer;
                container.scrollTop = container.scrollHeight;
            });
        },

        sendMessage() {
            if (!this.newMessage.trim() || this.userCoins < 1) return;
            
            const message = {
                id: Date.now(),
                content: this.newMessage,
                time: new Date(),
                isSelf: true
            };

            this.currentChat.messages.push(message);
            this.currentChat.lastMessage = this.newMessage;
            this.currentChat.lastTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            this.userCoins--;
            this.newMessage = '';

            // 滚动到最新消息
            this.$nextTick(() => {
                const container = this.$refs.messageContainer;
                container.scrollTop = container.scrollHeight;
            });
        },

        sendGift(gift) {
            if (this.userCoins < gift.price) {
                alert('金币余额不足！');
                return;
            }

            const message = {
                id: Date.now(),
                content: `送出了 ${gift.emoji} ${gift.name}`,
                time: new Date(),
                isSelf: true,
                isGift: true
            };

            this.currentChat.messages.push(message);
            this.userCoins -= gift.price;
            this.showGiftOverlay = false;
        },

        formatTime(date) {
            const now = new Date();
            const messageDate = new Date(date);
            
            if (messageDate.toDateString() === now.toDateString()) {
                return messageDate.toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                });
            }
            
            return messageDate.toLocaleDateString('zh-CN', { 
                month: 'numeric', 
                day: 'numeric'
            });
        },

        formatMessageTime(date) {
            return new Date(date).toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit'
            });
        },

        formatDate(date) {
            return new Date(date).toLocaleDateString('zh-CN', { 
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            });
        },

        shouldShowDate(message, index, messages) {
            if (index === 0) return true;
            
            const currentDate = new Date(message.time);
            const prevDate = new Date(messages[index - 1].time);
            
            return currentDate.toDateString() !== prevDate.toDateString();
        },

        userProfile: {
            name: "Alex Chen",
            avatar: "https://i.pravatar.cc/300",
            mbti: "INFJ",
            zodiac: "♌️ 狮子座",
            chineseZodiac: "🐯 虎",
            gender: "男",
            height: 175,
            weight: 65,
            seeking: "女性",
            interests: ["旅行", "摄影", "美食", "音乐", "电影"],
            relationshipGoal: "深度交流",
            hairColor: "黑色",
            eyeColor: "黑色",
            bodyType: "普通",
            country: "中国",
            countryCode: "CN",
        },

        availableInterests: [
            "旅行", "摄影", "美食", "音乐", "电影", "运动",
            "阅读", "写作", "绘画", "游戏", "编程", "投资",
            "瑜伽", "冥想", "烹饪", "园艺", "宠物", "时尚",
            "设计", "科技"
        ],

        showEditProfile: false,
        editingProfile: null,

        startEditProfile() {
            this.editingProfile = {
                ...this.userProfile,
                interests: [...(this.userProfile.interests || [])],
                country: this.userProfile.country || "中国",
                countryCode: this.userProfile.countryCode || "CN",
                height: this.userProfile.height || 170,
                weight: this.userProfile.weight || 60,
                gender: this.userProfile.gender || "男",
                hairColor: this.userProfile.hairColor || "黑色",
                eyeColor: this.userProfile.eyeColor || "黑色",
                bodyType: this.userProfile.bodyType || "普通",
                seeking: this.userProfile.seeking || "女性",
                mbti: this.userProfile.mbti || "INFJ"
            };
            this.showEditProfile = true;
        },

        saveProfile() {
            // 验证输入
            if (!this.editingProfile.height || !this.editingProfile.weight) {
                alert('请填写完整的身高和体重信息');
                return;
            }
            
            // 保存更新
            this.userProfile = {...this.editingProfile};
            this.showEditProfile = false;
            alert('个人资料已更新');
        },

        editAvatar() {
            // 模拟文件上传
            alert('暂不支持更换头像');
        },

        mbtiQuestions: [
            {
                question: "在社交场合中，你通常会：",
                options: [
                    "主动与他人交谈，享受社交",
                    "等待他人来搭话，保持安静",
                    "视情况而定，但更倾向于观察",
                    "感到不适，希望尽快离开"
                ],
                motivation: "了解您的社交倾向有助于为您匹配合适的聊天对象",
                dimension: "EI",
                scores: [2, -2, -1, -2]
            },
            {
                question: "当面对新的信息时，你倾向于：",
                options: [
                    "关注具体的细节和事实",
                    "寻找潜在的含义和可能性",
                    "分析信息之间的联系",
                    "相信直觉的判断"
                ],
                motivation: "了解您的思维方式可以提供更好的交流体验",
                dimension: "SN",
                scores: [2, -2, -1, -2]
            },
            // 添加更多问题...
        ],

        currentQuestionIndex: 0,
        selectedAnswer: null,
        testCompleted: false,
        mbtiResult: "",
        mbtiScores: {
            E: 0, I: 0,
            S: 0, N: 0,
            T: 0, F: 0,
            J: 0, P: 0
        },

        selectAnswer(index) {
            this.selectedAnswer = index;
            const question = this.mbtiQuestions[this.currentQuestionIndex];
            const score = question.scores[index];
            
            // 更新分数
            switch(question.dimension) {
                case "EI":
                    this.mbtiScores.E += score > 0 ? score : 0;
                    this.mbtiScores.I += score < 0 ? -score : 0;
                    break;
                case "SN":
                    this.mbtiScores.S += score > 0 ? score : 0;
                    this.mbtiScores.N += score < 0 ? -score : 0;
                    break;
                case "TF":
                    this.mbtiScores.T += score > 0 ? score : 0;
                    this.mbtiScores.F += score < 0 ? -score : 0;
                    break;
                case "JP":
                    this.mbtiScores.J += score > 0 ? score : 0;
                    this.mbtiScores.P += score < 0 ? -score : 0;
                    break;
            }
            
            // 延迟后进入下一题
            setTimeout(() => {
                if (this.currentQuestionIndex < this.mbtiQuestions.length - 1) {
                    this.currentQuestionIndex++;
                    this.selectedAnswer = null;
                } else {
                    this.completeTest();
                }
            }, 500);
        },

        completeTest() {
            this.mbtiResult = this.calculateMbtiType();
            this.testCompleted = true;
            
            // 更新用户资料
            this.userProfile.mbti = this.mbtiResult;
        },

        calculateMbtiType() {
            return (
                (this.mbtiScores.E > this.mbtiScores.I ? 'E' : 'I') +
                (this.mbtiScores.S > this.mbtiScores.N ? 'S' : 'N') +
                (this.mbtiScores.T > this.mbtiScores.F ? 'T' : 'F') +
                (this.mbtiScores.J > this.mbtiScores.P ? 'J' : 'P')
            );
        },

        getMbtiDescription(type) {
            const descriptions = {
                'INTJ': '独立思考者，擅长制定战略和长期规划',
                'INTP': '逻辑思维者，喜欢探索理论和抽象概念',
                'ENTJ': '天生的领导者，善于组织和执行计划',
                'ENTP': '创新者，喜欢挑战和探索可能性',
                // 添加其他类型的描述...
            };
            return descriptions[type] || '独特而有趣的性格类型';
        },

        shareResult() {
            // 生成分享链接
            const shareText = `我的MBTI类型是 ${this.mbtiResult}！来测测你的类型吧～`;
            alert('分享功能开发中\n' + shareText);
        },

        restartTest() {
            this.currentQuestionIndex = 0;
            this.selectedAnswer = null;
            this.testCompleted = false;
            this.mbtiResult = "";
            this.mbtiScores = {
                E: 0, I: 0,
                S: 0, N: 0,
                T: 0, F: 0,
                J: 0, P: 0
            };
        },

        tasks: [
            {
                id: 1,
                icon: "👋",
                title: "每日登录",
                description: "登录应用获得奖励",
                reward: 10,
                completed: false
            },
            {
                id: 2,
                icon: "💬",
                title: "发起3次对话",
                description: "与其他用户开始新对话",
                reward: 20,
                completed: false
            },
            {
                id: 3,
                icon: "🤝",
                title: "邀请好友",
                description: "邀请一位好友加入获得奖励",
                reward: 50,
                completed: false
            },
            {
                id: 4,
                icon: "📢",
                title: "关注官方频道",
                description: "关注Telegram官方频道获得奖励",
                reward: 30,
                completed: false
            }
        ],

        loginStreak: 3,
        showLoginReward: false,

        get incompleteTasks() {
            return this.tasks.filter(task => !task.completed);
        },

        completeTask(task) {
            if (task.completed) return;
            
            task.completed = true;
            this.userCoins += task.reward;
            this.completedTasks++;
            this.taskProgress = (this.completedTasks / this.totalTasks) * 100;
            
            // 更新未完成任务标记
            this.hasUncompletedTasks = this.incompleteTasks.length > 0;
        },

        getDayReward(day) {
            const rewards = {
                1: "10 💰",
                2: "15 💰",
                3: "20 💰",
                4: "25 💰",
                5: "30 💰",
                6: "35 💰",
                7: "40 💰",
                8: "45 💰",
                9: "50 💰",
                10: "100 💰"
            };
            return rewards[day] || "10 💰";
        },

        claimLoginReward() {
            const reward = parseInt(this.getDayReward(this.loginStreak).split(" ")[0]);
            this.userCoins += reward;
            this.showLoginReward = false;
            alert(`领取成功！获得 ${reward} 金币`);
        },

        message: 'Welcome to MysticTalk',
        init() {
            console.log('App initialized');
            this.detectCountry();
        },

        startRandomMatch() {
            alert('开始随机匹配...');
        },

        sayHi(user) {
            alert(`向 ${user.name} 打招呼`);
        },

        // 任务相关数据
        totalTasks: 5,
        completedTasks: 2,
        taskProgress: 40, // 百分比

        dailyTasks: [
            {
                id: 1,
                title: "完成一次匹配聊天",
                description: "与新朋友聊天超过5分钟",
                reward: 50,
                completed: false,
                progress: { current: 0, total: 1 }
            },
            {
                id: 2,
                title: "发送3个表情",
                description: "在聊天中使用表情",
                reward: 30,
                completed: true,
                progress: { current: 3, total: 3 }
            },
            {
                id: 3,
                title: "更新个人资料",
                description: "完善你的个人信息",
                reward: 20,
                completed: false
            }
        ],

        weeklyChallenges: [
            {
                id: 1,
                title: "社交达人",
                description: "完成10次成功匹配",
                reward: 200,
                progress: { current: 4, total: 10 },
                canClaim: false,
                claimed: false
            },
            {
                id: 2,
                title: "活跃聊天者",
                description: "累计聊天时长达到60分钟",
                reward: 300,
                progress: { current: 45, total: 60 },
                canClaim: false,
                claimed: false
            }
        ],

        // 任务相关方法
        claimReward(challenge) {
            if (challenge.canClaim && !challenge.claimed) {
                challenge.claimed = true;
                // 这里可以添加领取奖励的逻辑
                alert(`恭喜获得 ${challenge.reward} 金币！`);
            }
        },

        invitedFriends: [
            {
                id: 1,
                name: "Tom",
                avatar: "https://i.pravatar.cc/150?img=4",
                status: "已加入",
                rewarded: true
            },
            {
                id: 2,
                name: "Lisa",
                avatar: "https://i.pravatar.cc/150?img=5",
                status: "待接受邀请",
                rewarded: false
            }
        ],

        inviteTelegramFriend() {
            alert('正在打开 Telegram...');
            // 模拟打开 Telegram 分享
        },

        showTelegramInvite: false,
        friendSearch: '',
        inviteFilter: 'all',
        
        // 统计数据
        get totalInvites() {
            return this.inviteRecords.length;
        },
        
        get successfulInvites() {
            return this.inviteRecords.filter(invite => invite.status === 'success').length;
        },
        
        get pendingInvites() {
            return this.inviteRecords.filter(invite => invite.status === 'pending').length;
        },
        
        // 邀请记录
        inviteRecords: [
            {
                id: 1,
                name: "Tom Wilson",
                avatar: "https://i.pravatar.cc/150?img=11",
                status: "success",
                time: "2024-03-15 14:30"
            },
            {
                id: 2,
                name: "Sarah Chen",
                avatar: "https://i.pravatar.cc/150?img=12",
                status: "pending",
                time: "2024-03-15 15:45"
            },
            // 更多记录...
        ],
        
        // Telegram 好友列表
        telegramFriends: [
            {
                id: 1,
                name: "Alice Brown",
                avatar: "https://i.pravatar.cc/150?img=21",
                invited: false
            },
            {
                id: 2,
                name: "Bob Smith",
                avatar: "https://i.pravatar.cc/150?img=22",
                invited: true
            },
            // 更多好友...
        ],
        
        // 过滤后的邀请记录
        get filteredInvites() {
            if (this.inviteFilter === 'all') return this.inviteRecords;
            return this.inviteRecords.filter(invite => invite.status === this.inviteFilter);
        },
        
        // 过滤后的 Telegram 好友
        get filteredTelegramFriends() {
            return this.telegramFriends.filter(friend =>
                friend.name.toLowerCase().includes(this.friendSearch.toLowerCase())
            );
        },
        
        // 获取状态文字
        getStatusText(status) {
            return {
                'success': '已加入',
                'pending': '待接受'
            }[status];
        },
        
        // 邀请 Telegram 好友
        inviteTelegramFriend(friend) {
            friend.invited = true;
            // 添加到邀请记录
            this.inviteRecords.push({
                id: Date.now(),
                name: friend.name,
                avatar: friend.avatar,
                status: 'pending',
                time: new Date().toLocaleString()
            });
            // 模拟发送邀请
            setTimeout(() => {
                alert(`已向 ${friend.name} 发送邀请`);
            }, 500);
        },
        
        // 选项数据
        hairColors: [
            { value: "黑色", label: "黑色" },
            { value: "棕色", label: "棕色" },
            { value: "金色", label: "金色" },
            { value: "红色", label: "红色" },
            { value: "灰色", label: "灰色" },
            { value: "其他", label: "其他" }
        ],
        
        eyeColors: [
            { value: "黑色", label: "黑色" },
            { value: "棕色", label: "棕色" },
            { value: "蓝色", label: "蓝色" },
            { value: "绿色", label: "绿色" },
            { value: "灰色", label: "灰色" },
            { value: "其他", label: "其他" }
        ],
        
        bodyTypes: [
            { value: "偏瘦", label: "偏瘦" },
            { value: "普通", label: "普通" },
            { value: "运动", label: "运动" },
            { value: "健壮", label: "健壮" },
            { value: "偏胖", label: "偏胖" },
            { value: "其他", label: "其他" }
        ],
        
        // MBTI测试相关
        showMbtiTest: false,
        
        startMbtiTest() {
            if (confirm('开始MBTI性格测试？这将会重置您当前的MBTI类型。')) {
                this.currentQuestionIndex = 0;
                this.selectedAnswer = null;
                this.testCompleted = false;
                this.mbtiResult = "";
                this.mbtiScores = {
                    E: 0, I: 0,
                    S: 0, N: 0,
                    T: 0, F: 0,
                    J: 0, P: 0
                };
                this.showMbtiTest = true;
                this.currentPage = 'mbti-test';
            }
        },

        showUserPreview: false,
        previewUser: null,

        viewUserProfile(user) {
            this.previewUser = {
                ...user,
                avatar: user.avatar || "https://i.pravatar.cc/300",
                name: user.name || "未知用户",
                mbti: user.mbti || "未知",
                zodiac: user.zodiac || "♌️ 狮子座",
                chineseZodiac: user.chineseZodiac || "🐯 虎",
                gender: user.gender || "未知",
                height: user.height || 170,
                weight: user.weight || 60,
                bodyType: user.bodyType || "普通",
                hairColor: user.hairColor || "黑色",
                eyeColor: user.eyeColor || "黑色",
                interests: user.interests || [],
                country: user.country || "未知",
                countryCode: user.countryCode || "UN",
            };
            this.showUserPreview = true;
        },

        sayHiToUser(user) {
            this.showUserPreview = false;
            this.sayHi(user);
        },

        // 新增国家相关数据和方法
        showCountryList: false,
        countrySearch: '',
        countries: [
            { name: "中国", code: "CN" },
            { name: "美国", code: "US" },
            { name: "日本", code: "JP" },
            { name: "韩国", code: "KR" },
            { name: "英国", code: "GB" },
            { name: "加拿大", code: "CA" },
            { name: "澳大利亚", code: "AU" },
            { name: "新加坡", code: "SG" },
            { name: "马来西亚", code: "MY" },
            { name: "泰国", code: "TH" },
            // 可以继续添加更多国家...
        ],

        // 根据国家代码获取国家名称
        getCountryName(code) {
            const country = this.countries.find(c => c.code === code);
            return country ? country.name : null;
        },

        // 过滤国家列表
        get filteredCountries() {
            return this.countries.filter(country => 
                country.name.toLowerCase().includes(this.countrySearch.toLowerCase())
            );
        },

        // 选择国家
        selectCountry(country) {
            this.editingProfile.country = country.name;
            this.editingProfile.countryCode = country.code;
            this.countrySearch = '';
            this.showCountryList = false;
        },

        // 添加 IP 检测方法
        async detectCountry() {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                this.userProfile.country = this.getCountryName(data.country) || "中国";
                this.userProfile.countryCode = data.country || "CN";
            } catch (error) {
                console.error('获取位置信息失败:', error);
                this.userProfile.country = "中国";
                this.userProfile.countryCode = "CN";
            }
        },

        // 注册流程相关状态
        registrationStep: 0,  // 0 表示未开始注册
        showRegistration: false,
        registrationData: {
            name: '',
            gender: '',
            birthdate: '',
            height: 170,
            weight: 60,
            country: '中国',
            countryCode: 'CN',
            hairColor: '黑色',
            eyeColor: '黑色',
            bodyType: '普通',
            seeking: '不限',
            interests: [],
            mbti: '',
        },

        // 注册步骤配置
        registrationSteps: [
            {
                title: '欢迎来到 MysticTalk',
                description: '让我们开始创建你的个人资料',
                field: 'welcome',
                type: 'welcome'
            },
            {
                title: '你的名字是？',
                description: '请输入你想在平台上使用的名字',
                field: 'name',
                type: 'text'
            },
            {
                title: '你的性别是？',
                description: '选择你的性别',
                field: 'gender',
                type: 'select',
                options: ['男', '女', '其他']
            },
            {
                title: '你的生日是？',
                description: '我们会根据你的生日计算星座',
                field: 'birthdate',
                type: 'date'
            },
            {
                title: '让我们了解你的 MBTI 性格',
                description: '完成一个简单的性格测试',
                field: 'mbti',
                type: 'mbtiTest'
            },
            {
                title: '身高体重',
                description: '告诉我们你的身高和体重',
                field: 'bodyInfo',
                type: 'bodyInfo'
            },
            {
                title: '外貌特征',
                description: '选择你的外貌特征',
                field: 'appearance',
                type: 'appearance'
            },
            {
                title: '你的兴趣爱好',
                description: '选择最多10个你感兴趣的话题（之后可以修改）',
                field: 'interests',
                type: 'interests'
            },
            {
                title: '你想认识什么样的人？',
                description: '选择你期望结识的对象',
                field: 'seeking',
                type: 'select',
                options: ['男性', '女性', '不限']
            }
        ],

        // 初始化方法修改
        async init() {
            // 检查登录状态
            const savedLoginState = localStorage.getItem('isLoggedIn');
            this.isLoggedIn = savedLoginState === 'true';
            
            if (this.isLoggedIn) {
                await this.detectCountry();
            }
        },

        // 注册相关方法
        startRegistration() {
            this.showRegistration = true;
            this.registrationStep = 0;
        },

        nextStep() {
            // 验证当前步骤
            if (!this.validateCurrentStep()) {
                return;
            }
            
            // 如果是最后一步，完成注册
            if (this.registrationStep === this.registrationSteps.length - 1) {
                this.completeRegistration();
                return;
            }

            this.registrationStep++;
        },

        previousStep() {
            if (this.registrationStep > 0) {
                this.registrationStep--;
            }
        },

        validateCurrentStep() {
            const currentStep = this.registrationSteps[this.registrationStep];
            switch (currentStep.field) {
                case 'name':
                    return this.registrationData.name.length >= 2;
                case 'gender':
                    return this.registrationData.gender !== '';
                case 'birthdate':
                    return this.registrationData.birthdate !== '';
                case 'mbti':
                    return this.registrationData.mbti !== '';
                case 'interests':
                    return this.registrationData.interests.length > 0;
                default:
                    return true;
            }
        },

        completeRegistration() {
            // 保存所有注册数据
            this.userProfile = {
                ...this.userProfile,
                ...this.registrationData
            };
            this.showRegistration = false;
            this.currentPage = 'home';
        },

        isLoggedIn: false,  // 新增登录状态

        // 登录方法
        async loginWithTelegram() {
            try {
                // 这里应该调用 Telegram Login Widget API
                // 目前使用模拟登录
                this.isLoggedIn = true;
                
                // 检查是否是首次登录
                const isFirstLogin = true; // 这里应该从服务器检查
                if (isFirstLogin) {
                    this.showRegistration = true;
                }
                
                // 初始化用户数据
                await this.detectCountry();
            } catch (error) {
                console.error('登录失败:', error);
                alert('登录失败，请重试');
            }
        },
    }
} 