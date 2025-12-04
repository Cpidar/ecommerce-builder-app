export default function SuccessPage({ searchParams }: any) {
  const tenant = searchParams.tenant;

  if (!tenant) {
    return <p>Missing tenant ID.</p>;
  }

  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="text-3xl font-semibold mb-4">Your Store Is Ready! 🎉</h1>
      <p className="mb-8 text-gray-600">Tenant ID: {tenant}</p>

      <a
        href={`https://${tenant}.your-domain.com`}
        className="underline text-blue-600"
      >
        Visit Your Storefront →
      </a>

      <br />

      <a
        href={`/cms?tenant=${tenant}`}
        className="underline text-blue-600 mt-4 inline-block"
      >
        Go to CMS Dashboard →
      </a>
    </div>
  );
}
