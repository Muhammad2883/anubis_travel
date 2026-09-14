<?php

namespace App\Filament\Resources;

use App\Models\Booking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?string $navigationGroup = 'Operations';

    protected static ?string $navigationLabel = 'Bookings • الحجوزات';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('booking_reference')
                    ->disabled()
                    ->required(),
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'قيد الانتظار (Pending)',
                        'confirmed' => 'مؤكد (Confirmed)',
                        'in_progress' => 'جاري التنفيذ (In Progress)',
                        'completed' => 'مكتمل (Completed)',
                        'cancelled' => 'ملغي (Cancelled)',
                    ])
                    ->required(),
                Forms\Components\TextInput::make('customer_name')->required(),
                Forms\Components\TextInput::make('customer_phone')->tel()->required(),
                Forms\Components\TextInput::make('customer_email')->email(),
                Forms\Components\TextInput::make('item_name')->required(),
                Forms\Components\TextInput::make('pickup_date')->required(),
                Forms\Components\TextInput::make('pickup_time')->required(),
                Forms\Components\TextInput::make('pickup_location')->required(),
                Forms\Components\TextInput::make('dropoff_location'),
                Forms\Components\TextInput::make('total_amount')->numeric()->prefix('EGP'),
                Forms\Components\Select::make('payment_status')
                    ->options([
                        'unpaid' => 'غير مدفوع (Unpaid)',
                        'deposit_paid' => 'تم دفع عربون (Deposit Paid)',
                        'paid' => 'مدفوع بالكامل (Paid)',
                        'refunded' => 'مسترد (Refunded)',
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('booking_reference')->searchable()->sortable()->bold(),
                Tables\Columns\TextColumn::make('customer_name')->searchable(),
                Tables\Columns\TextColumn::make('customer_phone')->searchable(),
                Tables\Columns\TextColumn::make('item_name')->limit(30),
                Tables\Columns\TextColumn::make('pickup_date')->sortable(),
                Tables\Columns\TextColumn::make('total_amount')->money('EGP')->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'confirmed',
                        'primary' => 'in_progress',
                        'secondary' => 'completed',
                        'danger' => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'completed' => 'Completed',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
