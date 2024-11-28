function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      {children}
    </main>
  );
}

export default PageLayout;
