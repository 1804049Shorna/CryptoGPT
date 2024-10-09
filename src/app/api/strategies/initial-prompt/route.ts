import { NextRequest, NextResponse } from "next/server";

import { supabase } from "src/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const userHeader = req.headers.get("x-user") as string;
        if (!userHeader) {
            return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
        }
        const user = JSON.parse(userHeader);
        const body = await req.json();
        console.log('body', body);

        const { prompt } = body;
        const { data, error } = await supabase
            .from('strategy_initial_prompts')
            .upsert({
                user_id: user.id,
                prompt,
            }, { onConflict: "user_id" })
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data[0], { status: 200 });
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const userHeader = req.headers.get("x-user") as string;
        if (!userHeader) {
            return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
        }
        const user = JSON.parse(userHeader);

        const { data, error } = await supabase
            .from('strategy_initial_prompts')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json(null, { status: 404 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const userHeader = req.headers.get("x-user") as string;
        if (!userHeader) {
            return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
        }
        const user = JSON.parse(userHeader);
        const body = await req.json();

        const { prompt } = body;
        console.log(body);

        const { data, error } = await supabase
            .from('strategy_initial_prompts')
            .update({ prompt })
            .eq('user_id', user.id)
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(data[0], { status: 200 });
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const userHeader = req.headers.get("x-user") as string;
        if (!userHeader) {
            return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
        }
        const user = JSON.parse(userHeader);

        const { error } = await supabase
            .from('strategy_initial_prompts')
            .delete()
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}