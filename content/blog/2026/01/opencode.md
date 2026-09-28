---
date: "2026-01-13"
title: "Opencode 安装与配置"
tags:
  - Tools
  - Agent
toc: true
draft: false
---

[Opencode](https://opencode.ai/) 是一个强大的开源代码工具。

<!--more-->

但是它的默认提示词可能不够好，可以通过 [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) 来增强。

| 对比项 | Opencode | Claude Code |
| :--- | :--- | :--- |
| **来源** | 开源 | 闭源 |
| **模型支持** | 可接入各种供应商 | 只能通过环境变量设置 |
| **灵活性** | 支持 session 内切换模型 | 较弱 |
| **可玩性** | 强 | 一般 |
| **效果** | 视模型而定 | 一般更好 |



### 安装

```bash
# 安装 bun
curl -fsSL https://bun.sh/install | bash
# 安装 opencode
curl -fsSL https://opencode.ai/install | bash
# 安装
bunx oh-my-opencode install # 这里会直接连接到 antigravity 账号
```

### 添加自定义 API 模型

edit `~/.config/opencode/opencode.json`

```json
  "provider": {
    "your_provider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "YOUR_PROVIDER",
      "options": {
        "baseURL": "<your_base_url>"
      },
      "models": {
        "DeepSeek-V3.2": {
          "name": "DeepSeek-V3.2",
          "tool_call": true,
          "reasoning": true,
          "options": {
            "chat_template_kwargs": {
              "thinking": true
            }
          },
        },
        "DeepSeek-V3.2-Speciale": {
          "name": "DeepSeek-V3.2-Speciale",
          "tool_call": true,
          "reasoning": true,
          "options": {
            "chat_template_kwargs": {
              "thinking": true
            }
          },
        },
        "GLM-4.7": {
          "name": "GLM-4.7",
          "tool_call": true,
          "reasoning": true,
        }
      }
    },
```

### 配置 Agent

编辑 `~/.config/opencode/oh-my-opencode.json`，这里具体角色的定义可以参考 [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)介绍，直接问 Opencode 「解释一下 oh-my-opencode 的作用」。

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "google_auth": false,
  "agents": {
    "Sisyphus": {
      "model": "your_provider/DeepSeek-V3.2"
    },
    "librarian": {
      "model": "your_provider/GLM-4.7"
    },
    "explore": {
      "model": "your_provider/GLM-4.7"
    },
    "oracle": {
      "model": "your_provider/DeepSeek-V3.2-Speciale"
    },
    "frontend-ui-ux-engineer": {
      "model": "google/antigravity-gemini-3-pro-high"
    },
    "document-writer": {
      "model": "google/antigravity-gemini-3-flash"
    },
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash"
    }
  }
}
```

### 使用

Opencode 开启之后：

1. /connect 连接到你用的提供商（填入 APIKEY）
2. tab 切换 plan 模式 agent，@ 可以召唤各个 agent

### Bonus - Claude Code 使用 DS 官方 API

不要覆盖系统环境变量，正确姿势为新建一个 `~/.claude/ds.json`

```json
{
  "alwaysThinkingEnabled": true,
  "enabledPlugins": {
    "example-skills@anthropic-agent-skills": true
  },
  "env":{
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "<key>",
    "API_TIMEOUT_MS": "600000",
    "ANTHROPIC_MODEL": "DeepSeek-V3.2",
    "ANTHROPIC_SMALL_FAST_MODEL": "DeepSeek-V3.2",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

然后通过 `claude --settings ~/.claude/ds.json` 启动，这样不会干扰正常的 CC 订阅的使用，~~当然你想 simply f**k anthropic 也是可以的~~。
