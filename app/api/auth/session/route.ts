import { NextRequest, NextResponse } from "next/server";

export default function GET(request: NextRequest) {

    const body = {code: 'code'}

    return NextResponse.json(body, {status: 200})

}