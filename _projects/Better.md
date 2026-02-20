---
layout: project
title: Better
description: >
    Better is a betting app we built during HackPrinceton, where we won Best Use of the Knot API. Knot is an API that allows developers to connect users to merchants everywhere. I was paired with three other developers, and I worked on the iOS version of the app, implementing the API to track users’ purchases from merchants they liked.

date: 2021-12-12
category: hackathons # work | personal | hackathons

hackathon_winner: true
hackathon_event: ["Best use of Knot API"]
hackathon_org: "Princeton University"

tech: [SwiftUI, Swift, Firebase, Firestore, Knotapi, TypeScript]
image: /assets/images/Better.png
---


The idea was to let users bet on themselves so their friends could motivate them to do better. For example, someone could bet on getting an “A” on their next math exam or on stopping junk food. Their friends would support them by betting against them.

If a user succeeds, they win back the amount they staked plus the money contributed by their friends. If they fail, their friends get their money refunded along with an additional 100% of what they contributed, paid out from the user’s stake. Any remaining funds go to a charity chosen by the user.

We also needed a way to validate whether a challenge was actually completed. Since the Knot API was sponsoring a track that required participants to use their API, we decided to let users link their merchant accounts. This allowed users to create challenges like “stop ordering food online,” and the app could verify completion by checking whether purchases from services like Uber Eats were made.

I worked on implementing the Knot API for the iOS version of the app using Swift and SwiftUI, and on integrating Firebase alongside my hackathon buddy, [James Choi](https://www.linkedin.com/in/james-choi-b6562124b/).

This was a block that listed the merchants provided by the Knot API:

```swift
func getData() async {
    isLoadingMerchants = true

    defer { isLoadingMerchants = false }

    guard let url = URL(string: urlString) else {
        print("Could not create a URL from: \(urlString)")
        return
    }

    do {
        let (data, _) = try await URLSession.shared.data(from: url)

        guard let returned = try? JSONDecoder().decode([Merchant].self, from: data) else {
            print("Could not decode returned JSON data")
            return
        }

        self.merchants = returned
    } catch {
        print("Could not get data from: \(urlString)")
    }
}
```

Then you can interact with the data once a user selects a merchant and chooses what action to perform:

```swift
func runSDK() async {

    if session == nil {
        print("Could not create session locally")
        return
    }

    if selectedMerchantId == nil {
        print("Need Merchant ID")
        return
    }

    let config = KnotConfiguration(
        sessionId: session ?? "1234",
        clientId: "",
        environment: .development,
        entryPoint: "onboarding",
        useCategories: true,
        useSearch: true,
        merchantIds: [selectedMerchantId ?? 0]
    )

    Knot.open(configuration: config, delegate: self)
}

func onSuccess(merchant: String) {
    print("Successfully authenticated.")
}

func onError(error: KnotError) {
    print("Error occurred: \(error.errorDescription)")
}

func onEvent(event: KnotEvent) {
    print("Received event: \(event.event)")
}

func onExit() {
    print("Knot session exited.")
}

func knotDidFinish(_ controller: UIViewController) {
    accountLinked = true
    // ...
}

```

-   [Hackathon link](https://devpost.com/software/bettr-9rb71p)
