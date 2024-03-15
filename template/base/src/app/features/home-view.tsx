const stack = [
  {
    name: "TanStack Router",
    url: "https://tanstack.com/router",
    textColor: "text-emerald-500",
    description: "Modern and scalable routing for react applications",
  },
];

export const HomeView = () => {
  return (
    <div className="root-wrapper">
      <div className="content-wrapper">
        <div>
          <h1 className="header">
            Create <span className="highlight-amber">Beeply</span> App
          </h1>
          <p className="get-started">
            Get started by editing <code>src/app/features/home-view.tsx</code>
          </p>
        </div>
        <div className="stack-wrapper">
          <h2 className="stack-header">Your Stack</h2>
          <div className="stack-list-wrapper">
            {stack.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tech-card"
              >
                <span className={`tech-card-header ${item.textColor}`}>
                  {item.name}
                  <span className="tech-card-arrow">→</span>
                </span>
                <span className="tech-card-desc">{item.description}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
