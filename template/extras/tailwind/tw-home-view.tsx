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
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-center h-screen p-8 flex-col gap-8">
        <div>
          <h1 className="font-semibold text-4xl">
            Create <span className="text-yellow-500">Beeply</span> App
          </h1>
          <p className="mt-4 text-neutral-500 whitespace-pre-line">
            Get started by editing{" "}
            <code className="py-1 font-mono font-medium px-2 ml-1 border-[0.0125rem] bg-amber-200 border-amber-300 rounded-md">
              src/app/features/home-view.tsx
            </code>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-lg">Your Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stack.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white p-4 rounded-md border-[0.0125rem] border-neutral-100 flex flex-col gap-0.5 group hover:shadow-sm transition-shadow"
              >
                <span className={`font-medium text-xl ${item.textColor}`}>
                  {item.name}
                  <span className="ml-2 group-hover:ml-4 transition-all group-hover:text-blue-600 text-black">
                    →
                  </span>
                </span>
                <span className="text-sm">{item.description}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
