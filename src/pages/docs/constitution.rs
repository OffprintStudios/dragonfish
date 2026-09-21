use leptos::prelude::*;

#[component]
pub fn ConstitutionPage() -> impl IntoView {
    view! {
        <article>
            <h1 id="-the-offprint-constitution-"><strong>"The Offprint Constitution"</strong></h1>
            <p>"Hello! Whether you’re here because you’re about to sign up for your own Offprint account, or you just want to check back and reference our rules and regulations, welcome! This Constitution represents a "<strong>"living document"</strong>" of the Rules of Engagement for Offprint and the Offprint Café. As such, "<strong>"everything in this document is subject to change"</strong>". Please bear that in mind while reading."</p>
            <p>"To consolidate as much important information as possible, this document is broken up into four different sections:"</p>
            <ul>
                <li><strong>"Section I:"</strong>" The Code of Conduct  "</li>
                <li><strong>"Section II:"</strong>" Offprint Staff &amp; How We Handle Enforcement  "</li>
                <li><strong>"Section III:"</strong>" Specific Considerations For The Offprint Café  "</li>
                <li><strong>"Section IV:"</strong>" How To Contact Us"</li>
            </ul>
            <p>"If you have any questions about items within this Constitution, such as a specific item or enforcement policy requiring a bit more in the way of clarification, contact the Administrators so that we may touch base with the team and provide an adequate solution."</p>

            <h2 id="-section-i-the-code-of-conduct-"><strong>"Section I: The Code of Conduct"</strong></h2>
            <p>"This Code of Conduct applies to "<strong>"all"</strong>" interactions relating to Offprint, whether they be on Offprint proper or within the Offprint Café. This includes, but is not limited to:"</p>
            <ul>
                <li>"User Blogs  "</li>
                <li>"Published &amp; Unpublished Works  "</li>
                <li>"Comments  "</li>
                <li>"Discussions in the Offprint Café"</li>
            </ul>
            <p>"Failure to adhere to these guidelines, or to correct behavior brought to your attention by any member of the moderation team, will result in the actions specified within "<strong>"Section II"</strong>", which may include content removal, temporary/permanent account suspensions, and—in extreme cases—legal action."</p>
            <p>"Please keep in mind the following guidelines:"</p>
            <ol>
                <li>"Be civil, courteous, and considerate to all your fellow Offprint members  "</li>
                <li>"Refrain from inciting, encouraging, or enacting personal attacks towards other users or real persons in all content related to Offprint  "</li>
                <li>"All forms of discrimination or bigotry (sexism, racism, homophobia, transphobia, religious persecution, etc.) directed towards users or other persons are forbidden  "</li>
                <li>"Do not link to, post, or encourage illegal content on Offprint. This includes providing access to pirated software, encouragement of piracy/theft or other criminal actions, or work that is not your own without proper attribution  "</li>
                <li>"Do not share art without sources, and do not use cover art without permission and correct sources.  "</li>
                <li>"Users may not engage in spam-posting, phishing, or similar behaviors  "</li>
                <li>"Do not fish for interaction with your work, such as offering rewards in exchange for following or voting on works  "</li>
                <li>"Do not contact any Chat Moderators (aka @Bouncers in the Offprint Café) with moderation issues pertaining to the site. They are not able to handle those. For issues pertaining to the Café, however, please do not ping @Bouncers frivolously, only when there is an actual issue that needs addressing  "</li>
                <li>"Do not contact any Site Moderators (aka @Barbacks in the Offprint Café) with moderation issues pertaining to the Café. While they may be able to assist when no Chat Moderators are present, it is not their job, and they will defer to Chat Moderator discretion at all times within the Café  "</li>
                <li>"Users may not share the private information of others (i.e. home address, legal information, etc.) either on or off-site " </li>
                <li>"Ban-evading behavior is prohibited. Any attempt to circumvent security measures put in place by site staff will be met with further, harsher punishments. To appeal a ban, please contact beatriz@offprint.net  "</li>
                <li>"Users may not create alternate accounts for any reason. Please, instead, make use of our extensive Profiles system for things like NSFW alts, etc  "</li>
                <li>"All rules detailed here are subject to moderator discretion, and are subject to change as staff sees necessary"</li>
            </ol>

            <h2 id="-section-ii-offprint-staff-how-we-handle-enforcement-"><strong>"Section II: Offprint Staff &amp; How We Handle Enforcement"</strong></h2>
            <p>"Before proceeding, keep in mind that we will be outlining the specific enforcement policies as they relate to the Offprint Café. As we progress through this Alpha period and move into Beta, we will be drafting and outlining the specific policies of Offprint Staff as they pertain to Offprint proper. "<em>"The policies of the Café do not extend to Offprint itself."</em>" As these two areas of Offprint are, in effect, different kinds of communities altogether, and therefore require entirely different approaches to moderation, we must stress that "<strong>"making assumptions of Offprint moderation policy based on policies enacted within the Offprint Café is unnecessary."</strong></p>
            <p>"Bearing that in mind, the following policies are specific to the Offprint Café:"</p>
            <h3 id="-offprint-caf-staff-hierarchy-"><strong>"Offprint Café Staff Hierarchy"</strong></h3>
            <ul>
                <li>"@Head Bartender &amp; @Warehouse Manager: Offprint administration, both in the Café and on Offprint proper. The @Head Bartender retains ultimate authority over moderation decisions on both Offprint and in the Offprint Café, while the @Warehouse Manager is responsible for the development, testing, and deployment of Offprint itself. "<strong>"Do not come to the @Warehouse Manager with moderation issues, and do not "<em>"immediately"</em>" go to the @Head Bartender when there’s an issue."</strong>  </li>
                <li>"@Bouncers: Chat moderators. These users are responsible for managing the Café and ensuring a smooth and safe experience for all users. They will be relatively active within the server and attempt to deal with any problems as they arise or beforehand. Where they cannot, users should feel free to tag them whenever an issue arises. DMing @Bouncers is also fine, but be aware that that will likely lead to a slower response.  "</li>
                <li>"@Barbacks: Site moderators. These users are responsible for managing Offprint proper and ensuring all site reports are taken care of and actioned appropriately. They may be relatively inactive within the Café and will defer to @Bouncers when it comes to Café moderation issues."</li>
            </ul>
            <p>"On Baseline Policy: To be clear, "<strong>"no member of staff is above the Code of Conduct"</strong>". It is the responsibility of staff to enforce the Code of Conduct, but to do so effectively means to be bound by it as well. Similarly, "<strong>"no member of staff may issue any punishment based on personal bias"</strong>". All are equal under the Code of Conduct, and all will be treated the same. However, "<strong>"staff members are allowed to use discretion when enforcing the Code of Conduct"</strong>.</p>
            <p>"On New Issues: There will inevitably be new areas of concern on which staff need to act even if there is no specific policy regarding them. Where possible, action will be deliberated, or otherwise using a @Bouncer’s best judgment. Once the situation is resolved, a discussion will be had on the response including feedback from the community, and the Code of Conduct will be expanded or revised after review to establish a clear policy for the future. If needed, adjustments or a reversal to the initial action may also be taken."</p>
            <p>"On Escalation: Generally, we use a loose ‘three strikes’ system, starting with warnings. Three ‘Clustered’ warnings for any reason, or three warnings for a specific infraction over a longer period of time may result in a timeout. Timeouts work similarly, with three ‘clustered’ timeouts or three timeouts for the same infraction over a longer period of time may result in further action, such as a ban, though this action will be deliberated on."</p>

            <h2 id="-section-iii-specific-considerations-for-the-offprint-caf-"><strong>"Section III: Specific Considerations for the Offprint Café"</strong></h2>
            <h3 id="-the-tools-we-use-"><strong>"The Tools We Use"</strong></h3>
            <p>"Our chief moderation tool within the Offprint Café is a bot called @Bernard. Its main role is to automate certain tasks on behalf of the moderation team, and to make it easier for us to collectively enforce action. We understand, however, that this power comes with a responsibility to use it properly. Below are some of the tools @Bernard gives us access to, and what we will use each for in the application of policy:"</p>
            <ul>
                <li><em>"!rapsheet or !rapsheet [user]:"</em>" This sounds scary, but it is simply the name of the tool @Bernard provides for tracking actions we take. It contains a list of any warnings or other actions, but is also used to keep track of things like victims of ongoing issues; or ,where relevant, a user’s site handle, if it differs and we have been informed. "<strong>"Your personal rapsheet is available upon request."</strong>" Either ping or PM @Bouncers or, and they can create a private thread with the user and Bernard to make the rapsheet available.  "</li>
                <li><em>"!note [user] [note]:"</em>" Notes are simply that. Just notes. These are used to track things like victims of infractions, alternate site handles, and additional considerations.  "</li>
                <li><em>"!warn [user] [reason]:"</em>" Warnings are used when there is a clear rule violation or there is inappropriate behavior. Users will receive a DM, and the warning will be added to their rapsheet.  "</li>
                <li><em>"!timeout [user] [duration] [reason]:"</em>" Timeouts are used as a punishment after warnings, or to force users to take a break if they are especially heated. As a punishment they can last up to an entire day. As a cooldown they can last around one to two hours. They limit a user’s ability to interact with a server while they are active.  "</li>
                <li><em>"!ban [user] [duration] [reason]:"</em>" Bans remove a user from the server, and do not let them back in for a specified period of time, up to indefinitely. Most bans are permanent, and not made lightly."</li>
            </ul>
            <p>"On Public Vs. Private Action: This will depend on the situation. Any issue that has other users publicly responding, or pinging @Bouncers publicly will require a public response. If @Bouncers are otherwise only made aware privately, or they see the infraction and no public response, then the issue will be handled privately through DMs. If @Bouncers ask for a conversation to be stopped or taken to DMs, please respect this."</p>
            <p>"On Late Action: @Bouncers are not ever-present, so we do ask that users ping @Bouncers as soon as they see a problem. Occasionally however, an infraction or issue will come up and a bouncer will not be notified or discover it until later. There is no time limit on letting us know, and it is expected that @Bouncers will act on anything within a few days."</p>
            <p>"On Ambiguity: It is the nature of moderating a public space that there will be ambiguity. Various steps can be taken to mitigate issues around ambiguity. @Bouncers should confer, at least where there isn’t anything explicit laid out, and act on their best judgment. It is generally better to err on the side of caution and explain to the user why the action was taken. In these instances, a note will be applied to the user’s rapsheet, but will not be considered a warning. This is just to ensure that it’s known action was taken."</p>

            <h2 id="-section-iv-how-to-contact-us-"><strong>"Section IV: How To Contact Us"</strong></h2>
            <p>"On Ban Appeals: Bans can be appealed by contacting beatriz@offprint.net with the relevant information: whether you were banned from the Café or Offprint proper (or both!), what your username is, and why you want your ban lifted."</p>
        </article>
    }
}
