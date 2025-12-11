import CustomerList from "@/components/customers/customer-list";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard CRM</h2>
            <p className="text-muted-foreground">
              Sistem Manajemen Pelanggan
            </p>
          </div>
        </div>

        <CustomerList />
      </div>
    </main>
  );
}
