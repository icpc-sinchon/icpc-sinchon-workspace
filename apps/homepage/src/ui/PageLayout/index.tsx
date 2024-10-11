function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        margin: "0 auto",
      }}
    >
      {children}
    </main>
  );
}

export default PageLayout;
