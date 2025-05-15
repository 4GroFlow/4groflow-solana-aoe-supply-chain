use anchor_lang::prelude::*;

declare_id!("75Y6LyCnaUGwWu7GyDkVTrYBdDw9USyYRkoqEx9Xd43c");

#[program]
pub mod anchor_program {
    use super::*;

    /// Instrucción para crear un nuevo mensaje en la blockchain
    /// Este mensaje representa un evento en la cadena de suministro del aceite de oliva
    pub fn create_message(ctx: Context<CreateMessage>, content: String) -> Result<()> {
        let message = &mut ctx.accounts.message;
        let author = &ctx.accounts.author;
        
        // Validamos que el mensaje no sea demasiado largo
        if content.chars().count() > 280 {
            return Err(ErrorCode::MessageTooLong.into());
        }

        // Almacenamos la información del mensaje
        message.author = author.key();
        message.content = content;
        message.timestamp = Clock::get()?.unix_timestamp;

        msg!("Mensaje creado: {}", message.content);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMessage<'info> {
    #[account(
        init,
        payer = author,
        space = 8 + 32 + 4 + 280 + 8, // discriminator + pubkey + string prefix + max chars + timestamp
    )]
    pub message: Account<'info, Message>,
    
    #[account(mut)]
    pub author: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Message {
    pub author: Pubkey,    // 32 bytes: dirección de la wallet que creó el mensaje
    pub content: String,   // 4 + 280 bytes (max): contenido del mensaje (evento en la cadena de suministro)
    pub timestamp: i64,    // 8 bytes: momento de creación del mensaje
}

#[error_code]
pub enum ErrorCode {
    #[msg("El mensaje no puede exceder los 280 caracteres")]
    MessageTooLong,
}
