import { RsvpForm } from "@/components/RsvpForm";

function App() {
  return (
    <div className="min-h-screen w-full px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-xl">
        <RsvpForm />
        {/** 
        <p className="mt-6 text-center font-body text-sm font-medium text-ink/40">
          Hecho con cariño para su gran día 🤍
        </p>
        */}
      </div>
    </div>
  );
}

export default App;
