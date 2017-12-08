CREATE TABLE [dbo].[UserLookup]
(
	[UserId] INT NOT NULL,
	[OAuthId] VARCHAR(200) NOT NULL,
	[OAuthProvider] NVARCHAR(MAX) NOT NULL,
	[DateAdded] DATETIME NOT NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_UserLookup_Users] 
		FOREIGN KEY ([UserId])
		REFERENCES [Users]([Id])
		ON DELETE CASCADE
)

GO

CREATE INDEX [IX_UserLookup_OAuthId] ON [dbo].[UserLookup] ([OAuthId])
