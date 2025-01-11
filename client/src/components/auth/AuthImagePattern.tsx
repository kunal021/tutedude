const AuthImagePattern = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8 scale-[85%]">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-white/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-white/80">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
