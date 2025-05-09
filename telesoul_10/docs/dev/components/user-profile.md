# 用户资料组件 (UserProfile)

## 组件概述

用户资料组件是一个用于显示和编辑用户个人信息的可复用组件。它支持查看模式、编辑模式和只读模式，并集成了头像上传、资料验证等功能。

## 类型定义

```typescript
// 用户资料类型
interface UserProfile {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 组件属性
interface UserProfileProps {
  // 用户资料数据
  profile: UserProfile;
  
  // 组件模式
  mode: 'view' | 'edit' | 'readonly';
  
  // 是否显示编辑按钮
  showEditButton?: boolean;
  
  // 是否允许上传头像
  allowAvatarUpload?: boolean;
  
  // 是否显示验证状态
  showVerificationStatus?: boolean;
  
  // 回调函数
  onSave?: (profile: UserProfile) => Promise<void>;
  onCancel?: () => void;
  onAvatarUpload?: (file: File) => Promise<string>;
}

// 验证规则
interface ValidationRules {
  username: {
    required: boolean;
    minLength: number;
    maxLength: number;
    pattern?: RegExp;
  };
  email: {
    required: boolean;
    pattern: RegExp;
  };
  phone: {
    required: boolean;
    pattern: RegExp;
  };
  bio: {
    maxLength: number;
  };
}
```

## 组件功能

### 1. 资料显示
- 用户基本信息展示
- 头像显示
- 个人简介
- 位置信息
- 兴趣爱好标签

### 2. 资料编辑
- 表单验证
- 实时预览
- 头像上传
- 兴趣标签管理
- 自动保存草稿

### 3. 数据验证
- 用户名格式验证
- 邮箱格式验证
- 手机号格式验证
- 必填字段检查
- 长度限制检查

### 4. 状态管理
- 加载状态
- 保存状态
- 错误状态
- 验证状态
- 草稿状态

## 使用示例

```vue
<template>
  <UserProfile
    :profile="userProfile"
    mode="edit"
    :show-edit-button="true"
    :allow-avatar-upload="true"
    :show-verification-status="true"
    @save="handleSave"
    @cancel="handleCancel"
    @avatar-upload="handleAvatarUpload"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UserProfile } from '@/components/UserProfile';
import type { UserProfile as UserProfileType } from '@/types';

export default defineComponent({
  name: 'UserProfilePage',
  components: {
    UserProfile,
  },
  data() {
    return {
      userProfile: {
        id: '1',
        username: 'test_user',
        email: 'test@example.com',
        phone: '+8612345678901',
        avatar: 'https://example.com/avatar.jpg',
        bio: '这是一个测试用户',
        location: '北京',
        interests: ['编程', '阅读', '音乐'],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserProfileType,
    };
  },
  methods: {
    async handleSave(profile: UserProfileType) {
      try {
        await this.$api.user.updateProfile(profile);
        this.$message.success('保存成功');
      } catch (error) {
        this.$message.error('保存失败');
      }
    },
    handleCancel() {
      this.$router.back();
    },
    async handleAvatarUpload(file: File) {
      try {
        const url = await this.$api.user.uploadAvatar(file);
        this.userProfile.avatar = url;
        this.$message.success('头像上传成功');
      } catch (error) {
        this.$message.error('头像上传失败');
      }
    },
  },
});
</script>
```

## 样式定制

组件使用 CSS 变量实现主题定制：

```css
:root {
  --user-profile-bg: #ffffff;
  --user-profile-border: #e5e7eb;
  --user-profile-text: #1f2937;
  --user-profile-text-secondary: #6b7280;
  --user-profile-primary: #3b82f6;
  --user-profile-error: #ef4444;
  --user-profile-success: #10b981;
  --user-profile-warning: #f59e0b;
}
```

## 性能优化

1. 使用 `v-memo` 优化列表渲染
2. 使用 `shallowRef` 优化大对象响应
3. 使用 `defineAsyncComponent` 懒加载子组件
4. 使用 `v-once` 优化静态内容
5. 使用 `computed` 缓存计算结果

## 可访问性

1. 支持键盘导航
2. 提供 ARIA 标签
3. 支持屏幕阅读器
4. 提供高对比度模式
5. 支持字体大小调整

## 测试用例

```typescript
import { mount } from '@vue/test-utils';
import UserProfile from '@/components/UserProfile.vue';

describe('UserProfile', () => {
  it('renders profile information correctly', () => {
    const wrapper = mount(UserProfile, {
      props: {
        profile: mockProfile,
        mode: 'view',
      },
    });
    expect(wrapper.find('.username').text()).toBe(mockProfile.username);
  });

  it('validates form inputs correctly', async () => {
    const wrapper = mount(UserProfile, {
      props: {
        profile: mockProfile,
        mode: 'edit',
      },
    });
    await wrapper.find('input[name="email"]').setValue('invalid-email');
    expect(wrapper.find('.error-message').text()).toBe('邮箱格式不正确');
  });

  it('handles avatar upload correctly', async () => {
    const wrapper = mount(UserProfile, {
      props: {
        profile: mockProfile,
        mode: 'edit',
        allowAvatarUpload: true,
      },
    });
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    await wrapper.find('input[type="file"]').trigger('change', { target: { files: [file] } });
    expect(wrapper.emitted('avatar-upload')).toBeTruthy();
  });
});
```

## 错误处理

1. 表单验证错误
2. 网络请求错误
3. 文件上传错误
4. 权限错误
5. 数据保存错误

## 注意事项

1. 确保用户数据的安全性
2. 处理大文件上传
3. 优化移动端体验
4. 考虑国际化需求
5. 注意性能监控 