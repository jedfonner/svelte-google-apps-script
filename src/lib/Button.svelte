<script lang="ts">
  interface ButtonProps {
    children: () => any;
    onclick?: (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => any;
    size?: 'small' | 'medium' | 'large';
    style?: 'positive' | 'negative' | 'neutral';
    title?: string;
  }
  let { children, onclick, size = 'medium', title = 'Click me', style='neutral' }: ButtonProps = $props();
</script>

<button {onclick} {title} class="size-{size} style-{style}">
  <div class="content">
    {@render children()}
  </div>
</button>

<style>
  button.style-neutral {
    --button-bg-color: #37306166;
    --button-hover-color: #37306188;
    --button-color: white;
  }
  button.style-positive {
    --button-bg-color: rgb(93, 195, 117);
    --button-hover-color: #218838;
    --button-color: white;
  }
  button.style-negative {
    --button-bg-color: #fb7f8b;
    --button-hover-color: #c82333;
    --button-color: white;
  }
  button {
    cursor: pointer;
    /* padding: 3px; */
    border: 1px solid #ccc;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    background-color: var(--button-bg-color);
    color: var(--button-color);
    transition: background-color 0.3s, transform 0.1s;
  }
  button:hover {
    background-color: var(--button-hover-color);
  }
  button:active {
    transform: scale(0.9);
  }

  button.size-small {
    width: 16px;
    height: 16px;
    font-size: .75em;
  }
  button.size-medium {
    width: 24px;
    height: 24px;
    font-size: 1em;
  }
  button.size-large {
    width: 32px;
    height: 32px;
    font-size: 1.25em;
  }



</style>
