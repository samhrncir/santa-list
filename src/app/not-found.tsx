import Link from "next/link";
import Notice from "@/components/Notice";
import TopBar from "@/components/TopBar";
import Background from "@/components/scenes/Background";

export default function NotFound() {
  return (
    <>
      <Background scene="snow" />
      <div className="page">
        <TopBar />
        <main className="page-main">
          <Notice
            title="Lost in the snow"
            action={
              <Link href="/" className="btn btn-paper">
                Back to the start
              </Link>
            }
          >
            <p>There is no page here. The reindeer may have taken a wrong turn.</p>
          </Notice>
        </main>
      </div>
    </>
  );
}
