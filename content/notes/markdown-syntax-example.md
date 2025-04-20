# 📘 Markdown Syntax Guide

## 1. Headers (제목)

```markdown
# H1

## H2

### H3

#### H4

##### H5

###### H6
```

## 2. Blockquote (인용문)

```markdown
> This is a quote.
>
> > Nested quote.
> >
> > > Third level quote.
```

> This is a quote.
>
> > Nested quote.
> >
> > > Third level quote.

## 3. Lists (목록)

### ● Ordered List (순서 있는 목록)

```markdown
1. First
2. Second
3. Third
```

### ● Unordered List (순서 없는 목록)

```markdown
- Apple
  - Banana
    - Cherry

* Apple
  - Banana
    - Cherry

- Apple
  - Banana
    - Cherry
```

## 4. Code (코드)

### ● Indented Code Block (들여쓰기 코드 블럭)

```markdown
This is a paragraph:

    This is a code block.
```

### ● Fenced Code Block (펜스 코드 블럭)

<pre>
<code>
```
function hello() {
  console.log("Hello, Markdown!");
}
```
</code>
</pre>

```javascript
function hello() {
  console.log("Hello, Markdown!");
}
```

## 5. Horizontal Rule (수평선)

```markdown
---
```

---

## 6. Links (링크)

### ● Inline Link (직접 링크)

```markdown
[Google](https://www.google.com)
```

[Google](https://www.google.com)

### ● Reference Link (참조 링크)

```markdown
[Google][google-link]
[google-link]: https://www.google.com "Google Homepage"
```

[Google][google-link]
[google-link]: <https://www.google.com> "Google Homepage"

### ● Auto Link (자동 링크)

```markdown
<https://example.com>
<email@example.com>
```

<https://example.com>
<email@example.com>

## 7. Emphasis (강조)

```markdown
_Italic_
**Bold**
~~Strikethrough~~
```

- _Italic_
- **Bold**
- ~~Strikethrough~~

## 8. Images (이미지)

```markdown
![Alt Text](https://images.unsplash.com/photo-1732468928980-a294bc2845d6 "Optional Title")
```

![Alt Text](https://images.unsplash.com/photo-1732468928980-a294bc2845d6 "Optional Title")

<img src="https://images.unsplash.com/photo-1732468928980-a294bc2845d6" width="300px" title="Image Example">

## 9. Line Breaks (줄바꿈)

줄 끝에 스페이스 2~3개 이상을 입력하면 줄바꿈이 됩니다.

```markdown
Line one.␣␣  
Line two.
```

Line one.␣␣  
Line two.

---

## ✍️ 요약

마크다운은 간결한 문법으로 빠르게 문서를 작성할 수 있는 도구입니다. 위 문법만 숙지하면 거의 대부분의 마크다운 환경에서 활용 가능합니다.

---

## 📝 번역 및 설명 | Translation & Explanation

- **Fenced Code Block**: 코드 앞뒤에 ```를 넣어 감싸는 방식 (언어 지정 시 문법 하이라이팅 가능)
- **Auto Link**: `< >` 안에 URL이나 이메일을 넣으면 자동으로 링크됨
- **Horizontal Rule**: `---`, `***` 등의 줄을 써서 구분선 만들기
- **Strikethrough**: `~~취소선~~`을 만들 때 사용
