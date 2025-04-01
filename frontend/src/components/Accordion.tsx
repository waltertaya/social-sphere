import { useState } from "react";

const plans = [
  {
    name: "Basic",
    details:
      "Includes post scheduling and supports 1 social account. Ideal for individuals.",
    price: "$0/month",
  },
  {
    name: "Business",
    details:
      "Offers analytics, post scheduling, and supports up to 5 social accounts. Great for small teams.",
    price: "$10/month",
  },
  {
    name: "Premium",
    details:
      "Unlimited social accounts, advanced analytics, and priority support.",
    price: "$20/month",
  },
];

const Accordion = () => {
  const [expanded, setExpanded] = useState<number | null>(null);


  const toggleAccordion = (index: number): void => {
    setExpanded(expanded === index ? null : index); // Expand or collapse
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Upgrade Your Plan</h2>
      <div className="space-y-4">
        {plans.map((plan, index) => (
          <div key={index} className="border-none rounded-lg shadow-md">
            <button
              onClick={() => toggleAccordion(index)}
              className="flex justify-between items-center w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-t-lg"
            >
              <span className="font-medium text-gray-800">{plan.name}</span>
              <span className="text-blue-600">
                {expanded === index ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m4.5 15.75 7.5-7.5 7.5 7.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                )}
              </span>
            </button>
            {expanded === index && (
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-600">{plan.details}</p>
                <div className="text-lg font-semibold text-gray-800 mt-2">
                  {plan.price}
                </div>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
                  Upgrade
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accordion;
