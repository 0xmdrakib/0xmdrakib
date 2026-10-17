export function initializePersonalPage(panel: HTMLElement) {
  const canvas = panel.querySelector<HTMLCanvasElement>("#sf")!;
  const context = canvas.getContext("2d")!;
  let enabled = false;
  let frame = 0;
  let width = 0;
  let height = 0;
  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);
  const stars = Array.from({ length: 140 }, () => ({
    x: Math.random(), y: Math.random(), radius: Math.random() * .9 + .2,
    alpha: Math.random() * .5 + .05,
    change: (Math.random() * .004 + .001) * (Math.random() < .5 ? 1 : -1),
    hue: Math.random() < .65 ? 40 : 200,
  }));
  const draw = () => {
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
      star.alpha += star.change;
      if (star.alpha > .58 || star.alpha < .04) star.change *= -1;
      context.beginPath();
      context.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
      context.fillStyle = `hsla(${star.hue},50%,50%,${star.alpha})`;
      context.shadowColor = `hsla(${star.hue},70%,55%,.4)`;
      context.shadowBlur = 4;
      context.fill();
    }
    if (enabled && !document.hidden) frame = requestAnimationFrame(draw);
  };
  const setActive = (active: boolean) => {
    enabled = active;
    cancelAnimationFrame(frame);
    if (enabled && !document.hidden) draw();
  };
  document.addEventListener("visibilitychange", () => setActive(enabled));

  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove("reveal-pending");
        observer.unobserve(entry.target);
      }
    }, { threshold: .07 });
    panel.querySelectorAll(".r").forEach(element => {
      element.classList.add("reveal-pending");
      observer.observe(element);
    });
  }

  const form = panel.querySelector<HTMLFormElement>("#cf")!;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = String(data.get("subject") || "New Project Inquiry");
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\nProject Details:\n${data.get("message")}`;
    window.location.href = `mailto:0xmdrakib@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const message = panel.querySelector<HTMLElement>("#sm")!;
    message.style.display = "block";
    form.reset();
    window.setTimeout(() => { message.style.display = "none"; }, 5000);
  });
  return { setActive };
}
