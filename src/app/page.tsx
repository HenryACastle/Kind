import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { CloudCheck, ContactRound, Search, SlidersVertical, StickyNote, Tags } from "lucide-react";
export default function Home() {

  const features = [
    {
      title: "Intuitive Search",
      description: "Search across multiple fields with ease.",
      icon: <Search />,
      comingSoon: false,

    },
    {
      title: "Sync Contacts",
      description: "With Google, sync contacts to your devices.",
      icon: <CloudCheck />,
      comingSoon: false,
    },
    {
      title: "Notes",
      description: "Capture notes about your contacts your way.",
      icon: <StickyNote />,
      comingSoon: false,

    },
    {
      title: "Profile",
      description: "Share your profile with your contacts.",
      icon: <ContactRound />,
      comingSoon: false,

    },
    {
      title: "Custom Fields",
      description: "Have more information about your contacts.",
      icon: <SlidersVertical />,
      comingSoon: true,

    },


    {
      title: "Custom Tags",
      description: "Tag your contacts in a way that makes sense for you.",
      icon: <Tags />,
      comingSoon: true,
    },




  ]


  return (
    <div>

      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Contact Managment with Purpose</h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Do more with your contacts. Get organized, stay connected, and grow your network with ease.</p>

            <SignedIn>

              <Link href="/contacts">
                <Button>
                  View Contacts
                </Button>
              </Link>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <Button>
                  Sign In
                </Button>
              </Link>
            </SignedOut>






          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">

          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed with intention</h2>
            <p className="text-gray-500 sm:text-xl dark:text-gray-400">See how we can help you get more done with your contacts.</p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            {features.map((feature, idx) => (
              <div key={idx}>
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



    </div>
  );
}
